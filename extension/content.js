const rgbToHex = (text) => {
  if (!text || typeof text !== 'string') return text;
  return text.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g, (_match, r, g, b, a) => {
    const toHex = (n) => parseInt(n).toString(16).padStart(2, '0');
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    if (a !== undefined && parseFloat(a) < 1) {
      const alpha = Math.round(parseFloat(a) * 255).toString(16).padStart(2, '0');
      return `${hex}${alpha}`.toUpperCase();
    }
    return hex;
  });
};

const getDetailedStyle = (el) => {
  if (!el) return null;
  const s = window.getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  return {
    tag: el.tagName,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    color: s.color,
    backgroundColor: s.backgroundColor,
    padding: s.padding,
    borderRadius: s.borderRadius,
    border: s.border,
    boxShadow: s.boxShadow,
    display: s.display,
    gap: s.gap,
    transition: s.transition,
    cursor: s.cursor,
    width: rect.width,
    height: rect.height
  };
};

const sendProgress = (msg) => {
  chrome.runtime.sendMessage({ action: 'SCAN_PROGRESS', msg }).catch(() => {});
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const scanDOM = async () => {
  sendProgress('🔍 Mapping DOM structure...');
  await sleep(100);
  
  const allElements = Array.from(document.querySelectorAll('body *:not(script):not(style):not(svg)'))
    .filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 2 && rect.height > 2;
    });

  sendProgress(`📦 Found ${allElements.length} elements. Analyzing DNA...`);
  await sleep(100);
  
  const signatures = new Map();
  const limit = Math.min(allElements.length, 2000); 

  for (let i = 0; i < limit; i++) {
    if (i % 400 === 0) {
      sendProgress(`🧬 Processing elements: ${i}/${limit}...`);
      await sleep(10); // Give UI thread time to breathe
    }

    const el = allElements[i];
    const s = window.getComputedStyle(el);
    const signature = `${s.backgroundColor}-${s.color}-${s.borderRadius}-${s.fontSize}-${s.display}`;
    
    const isClickable = s.cursor === 'pointer' || el.tagName === 'BUTTON' || el.tagName === 'A';
    
    if (!signatures.has(signature)) {
      const text = (el.innerText || '').trim();
      signatures.set(signature, {
        style: getDetailedStyle(el),
        count: 1,
        examples: text ? [text.slice(0, 30)] : [],
        isClickable
      });
    } else {
      const data = signatures.get(signature);
      data.count++;
      const text = (el.innerText || '').trim();
      if (data.examples.length < 3 && text) data.examples.push(text.slice(0, 30));
    }
  }

  sendProgress('🏗️ Detecting layout blocks...');
  const layoutBlocks = Array.from(document.querySelectorAll('header, nav, section, footer, [role="banner"], [role="navigation"]'))
    .slice(0, 10)
    .map(el => ({ role: el.tagName, style: getDetailedStyle(el) }));

  sendProgress('🎨 Finalizing design tokens...');
  const rawTokens = {
    metadata: { title: document.title, url: window.location.href },
    visualSignatures: Array.from(signatures.values()).sort((a, b) => b.count - a.count).slice(0, 50),
    layoutBlocks
  };

  sendProgress('🚀 DNA extracted! Invoking AI Architect...');
  await sleep(500);
  return JSON.parse(rgbToHex(JSON.stringify(rawTokens)));
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SCAN_PAGE') {
    scanDOM().then(tokens => sendResponse({ tokens })).catch(err => sendResponse({ error: err.message }));
    return true; // Keep async open
  }
});