let currentAbortController = null;

const AI_PROMPT_TEMPLATE = (data) => `
You are a Lead Design Systems Architect at a top-tier tech company (Apple/Linear/Vercel). 
Your mission is to generate an EXTREMELY VERBOSE, GRANULAR, and ARCHITECTURAL DESIGN.md for: ${data.metadata.title}.

STRICT INSTRUCTIONS:
1. DO NOT BE CONCISE. Be as verbose and technical as possible.
2. Provide at least 4-5 dense paragraphs for every narrative section.
3. Every table must be exhaustive (minimum 10 rows if data exists).
4. Capture tiny details: pixel-perfect spacing, specific hex codes, motion cubic-bezier curves, z-index hierarchies, and accessibility aria-standards.
5. Use "Senior Engineer" tone: objective, technical, and precise.
6. OUTPUT ONLY MARKDOWN.

STRUCTURE & DEPTH REQUIREMENTS:

# Design System Specification: ${data.metadata.title}

## 1. Visual Theme & Philosophy
- Provide a deep dive into the "Why" behind the design. 
- Discuss the psychological impact of the color palette and spacing.
- Describe the visual "DNA" (e.g., edges, shadows, layering, surface treatments).

## 2. Color Architecture (Semantic & Functional)
- Exhaustive table of every color found.
- Include Primary, Secondary, Accents, Backgrounds, Borders, and Status colors.
- Define Semantic mapping (Success, Error, Warning, Info).
- Add CSS Variable names for each token.

## 3. Typography & Typeface Strategy
- Detailed hierarchy table (H1-H6, Body, Small, Mono).
- Include: Font-weight, Font-size (rem/px), Line-height, Letter-spacing.
- Define fallback stacks and rendering optimizations (antialiasing).

## 4. Layout, Grid & Spacing Tokens
- Define the base unit (e.g., 4px/8px).
- Provide a full spacing scale table (0 to 128px).
- Detail the container logic, grid columns, gaps, and breakpoints.

## 5. Component Engineering (The State Matrix)
- Deep dive into at least 8 core components (Buttons, Inputs, Cards, Nav, Modals, etc.).
- For EACH component, provide a table covering: Normal, Hover, Active, Focus, and Disabled states.
- Include Geometry (padding/radius) and Styling (bg/border/shadow).

## 6. Depth, Elevation & Motion
- Map the shadow system (Elevation levels 0-5) with precise RGBA values.
- Detail the animation system: durations (ms) and easing functions (cubic-bezier).

## 7. Interaction Guidelines (10+ Complex Rules)
- Define technical rules for focus traps, keyboard navigation, touch targets, and feedback loops.

## 8. Adaptive & Responsive Matrix
- Detailed breakpoint table.
- Describe specific layout shifts for each breakpoint.

## 9. Engineering & AI Iteration Guide (The "Bible" for Developers)
- 10+ strict rules for implementing this design system.
- Include naming conventions, folder structures, and performance budgets.

RAW SCAN DATA: ${JSON.stringify(data)}
`;

const saveState = async (state) => {
  await chrome.storage.local.set({ scanState: state });
};

const getState = async () => {
  const result = await chrome.storage.local.get('scanState');
  return result.scanState || { isScanning: false, lastStatus: 'Ready', scanResult: null, livePreview: '' };
};

const updateStatus = async (msg, preview = '', forceRefresh = false) => {
  const state = await getState();
  state.lastStatus = msg;
  if (preview) {
    state.livePreview = preview.replace(/<think>[\s\S]*?<\/think>/g, '').replace(/<think>[\s\S]*/g, '');
  }
  await saveState(state);
  chrome.runtime.sendMessage({ 
    action: 'STATUS_UPDATE', 
    status: msg, 
    preview: state.livePreview,
    forceRefresh: forceRefresh
  }).catch(() => {});
};

const getApiConfig = (provider, apiKey) => {
  const configs = {
    nvidia: { url: 'https://integrate.api.nvidia.com/v1/chat/completions', auth: `Bearer ${apiKey}` },
    openai: { url: 'https://api.openai.com/v1/chat/completions', auth: `Bearer ${apiKey}` },
    groq: { url: 'https://api.groq.com/openai/v1/chat/completions', auth: `Bearer ${apiKey}` },
    openrouter: { url: 'https://openrouter.ai/api/v1/chat/completions', auth: `Bearer ${apiKey}` },
    anthropic: { url: 'https://api.anthropic.com/v1/messages', auth: apiKey, extraHeaders: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' } },
    google: { url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions', auth: `Bearer ${apiKey}` }
  };
  return configs[provider] || configs.openai;
};

const callAIStreaming = async (tokens, settings) => {
  const { provider, apiKey, model } = settings;
  const config = getApiConfig(provider, apiKey);

  if (currentAbortController) currentAbortController.abort("NEW_SCAN_STARTED");
  currentAbortController = new AbortController();
  
  await updateStatus('AI: Establishing architect link...');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': config.auth,
    ...config.extraHeaders
  };

  const body = {
    model: model,
    messages: [{ role: 'user', content: AI_PROMPT_TEMPLATE(tokens) }],
    temperature: 0.1,
    max_tokens: 16384,
    stream: true
  };

  try {
    const response = await fetch(config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: currentAbortController.signal
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API_ERROR: ${errorData.error?.message || response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullContent = '';
    let lineBuffer = '';
    let lastChunkReceived = Date.now();
    let lastUpdate = 0;

    const watchdog = setInterval(() => {
      if (Date.now() - lastChunkReceived > 30000) {
        currentAbortController.abort("STREAM_STALLED");
      }
    }, 5000);

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        lastChunkReceived = Date.now();
        const chunk = decoder.decode(value, { stream: true });
        lineBuffer += chunk;
        
        const lines = lineBuffer.split('\n');
        lineBuffer = lines.pop();

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data: ') && cleanLine !== 'data: [DONE]') {
            try {
              const data = JSON.parse(cleanLine.slice(6));
              const content = data.choices ? data.choices[0]?.delta?.content : (data.delta?.text || '');
              if (content) {
                fullContent += content;
                const now = Date.now();
                if (now - lastUpdate > 150) { // Slightly faster updates
                  await updateStatus('AI: Drafting specification...', fullContent);
                  lastUpdate = now;
                }
              }
            } catch (e) { }
          }
        }
      }
    } finally {
      clearInterval(watchdog);
    }
    
    return fullContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

  } catch (err) {
    if (err.name === 'AbortError' || err === 'NEW_SCAN_STARTED') return null;
    if (err === 'STREAM_STALLED') throw new Error('CONNECTION_LOST: Stream stalled');
    throw err;
  } finally {
    currentAbortController = null;
  }
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SCAN_PROGRESS') {
    updateStatus(request.msg, '', true);
    return false;
  }

  if (request.action === 'GET_STATUS') {
    getState().then(sendResponse);
    return true;
  }

  if (request.action === 'DOWNLOAD_RESULT') {
    getState().then(async (state) => {
      if (state.scanResult) {
        const stateReset = { isScanning: false, lastStatus: 'Ready', scanResult: null, livePreview: '' };
        await saveState(stateReset);
        sendResponse({ success: true, result: state.scanResult });
      }
    });
    return true;
  }

  if (request.action === 'STOP_SCAN') {
    if (currentAbortController) currentAbortController.abort('MANUAL_STOP');
    saveState({ isScanning: false, lastStatus: 'ABORTED', scanResult: null, livePreview: '' }).then(() => {
      updateStatus('ABORTED', '', true);
      sendResponse({ success: true });
    });
    return true;
  }

  if (request.action === 'START_FULL_SCAN') {
    saveState({ isScanning: true, lastStatus: 'Initializing...', scanResult: null, livePreview: '' }).then(() => {
      sendResponse({ success: true });
      
      (async () => {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (!tab) throw new Error('NO_ACTIVE_TAB');

          const response = await chrome.tabs.sendMessage(tab.id, { action: 'SCAN_PAGE' });
          if (!response) throw new Error('DOM_ERROR: Refresh the page');
          
          const settings = await chrome.storage.sync.get(['provider', 'apiKey', 'model']);
          if (!settings.apiKey) throw new Error('MISSING_API_KEY');

          const content = await callAIStreaming(response.tokens, settings);
          if (content === null) return;

          const state = await getState();
          state.scanResult = { content, hostname: new URL(tab.url).hostname };
          state.isScanning = false;
          state.lastStatus = content.includes('## 9.') ? 'COMPLETED!' : 'WARNING: Output incomplete';
          state.livePreview = ''; 
          await saveState(state);
          await updateStatus(state.lastStatus, '', true); 
        } catch (err) {
          const state = await getState();
          state.isScanning = false;
          state.lastStatus = 'ERROR: ' + err.message;
          await saveState(state);
          await updateStatus(state.lastStatus, '', true);
        }
      })();
    });
    return true;
  }
  return true;
});
