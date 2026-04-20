const AI_PROMPT_TEMPLATE = (data) => `
You are a World-Class Design Systems Architect. Your mission is to generate an EXTREMELY VERBOSE, COMPREHENSIVE, and TECHNICAL DESIGN.md for: ${data.metadata.title}.
Match the precision of Apple/Linear systems. 

STRICT RULES:
1. OUTPUT ONLY MARKDOWN. No thinking tags, no preambles.
2. DO NOT RUSH. Provide exhaustive detail for every section.
3. COMPLETENESS MANDATORY: You MUST reach the "9. Iteration Guide" section. If you have tokens left, expand more on Component Matrix and Motion.
4. CONTENT: Capture every detail from visual signatures (hover, active states, padding, transition timings, flex-gap, z-index).

STRUCTURE:
# Design System Specification
## 1. Visual Theme (4 dense paragraphs)
## 2. Color Architecture (Full semantic mapping table)
## 3. Typography (Detailed hierarchy table including tracking/leading)
## 4. Layout & Spacing (Detailed 8px grid and spacing tokens table)
## 5. Component Engineering (State Matrix Tables for every unique element found)
## 6. Depth & Motion (Comprehensive transition and shadow mapping)
## 7. Interaction Guidelines (10 technical rules for UI feedback)
## 8. Responsive Strategy (Breakpoint and adaptive logic table)
## 9. Iteration Guide (10 detailed engineering rules for AI agents)

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

const callAIStreaming = async (tokens, settings) => {
  const { provider, apiKey, model } = settings;
  const baseUrl = provider === 'nvidia' 
    ? 'https://integrate.api.nvidia.com/v1/chat/completions'
    : 'https://api.openai.com/v1/chat/completions';

  await updateStatus('AI: Establishing architect link...');
  
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: AI_PROMPT_TEMPLATE(tokens) }],
      temperature: 0.1,
      max_tokens: 16384, // Capped at provider's 16k limit
      stream: true
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'AI Request Failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let fullContent = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        const cleanLine = line.trim();
        if (cleanLine.startsWith('data: ') && cleanLine !== 'data: [DONE]') {
          try {
            const data = JSON.parse(cleanLine.slice(6));
            const content = data.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              await updateStatus('AI: Drafting design system...', fullContent);
            }
          } catch (e) { }
        }
      }
    }
  } catch (err) {
    throw new Error('Stream interrupted: ' + err.message);
  }

  return fullContent.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
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
    saveState({ isScanning: false, lastStatus: 'Ready', scanResult: null, livePreview: '' }).then(() => {
      updateStatus('Ready', '', true);
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
          if (!tab) throw new Error('No active tab');

          const response = await chrome.tabs.sendMessage(tab.id, { action: 'SCAN_PAGE' });
          if (!response) throw new Error('No response from content script');
          if (response.error) throw new Error(response.error);
          
          const settings = await chrome.storage.sync.get(['provider', 'apiKey', 'model']);
          if (!settings.apiKey) throw new Error('API Key missing');

          const content = await callAIStreaming(response.tokens, settings);

          const state = await getState();
          state.scanResult = { content, hostname: new URL(tab.url).hostname };
          state.isScanning = false;
          state.lastStatus = 'COMPLETED: DESIGN.md is ready!';
          state.livePreview = ''; 
          await saveState(state);
          await updateStatus(state.lastStatus, '', true); 
        } catch (err) {
          await updateStatus('ERROR: ' + err.message, '', true);
        }
      })();
    });
    return true;
  }
  return true;
});