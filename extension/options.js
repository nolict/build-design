const providerModels = {
  nvidia: [
    { name: 'MiniMax M2.7', value: 'minimaxai/minimax-m2.7' },
    { name: 'GLM 5.1', value: 'z-ai/glm-5.1' },
    { name: 'Gemma 4 31B IT', value: 'google/gemma-4-31b-it' },
    { name: 'Nemotron 3 Super 120B', value: 'nvidia/nemotron-3-super-120b-a12b' },
    { name: 'Qwen 3.5 122B', value: 'qwen/qwen3.5-122b-a10b' },
    { name: 'MiniMax M2.5', value: 'minimaxai/minimax-m2.5' },
    { name: 'Step 3.5 Flash', value: 'stepfun-ai/step-3.5-flash' },
    { name: 'Kimi K2.5', value: 'moonshotai/kimi-k2.5' },
    { name: 'Kimi K2 Thinking', value: 'moonshotai/kimi-k2-thinking' }
  ],
  google: [
    { name: 'Gemini 3.1 Pro', value: 'gemini-3.1-pro' },
    { name: 'Gemini 3.1 Flash', value: 'gemini-3.1-flash' },
    { name: 'Gemini 3.1 Flash-Lite', value: 'gemini-3.1-flash-lite' },
    { name: 'Gemini 2.5 Pro', value: 'gemini-2.5-pro' },
    { name: 'Gemini 2.5 Flash', value: 'gemini-2.5-flash' },
    { name: 'Gemini 2.5 Flash-Lite', value: 'gemini-2.5-flash-lite' }
  ],
  anthropic: [
    { name: 'Claude Opus 4.7', value: 'claude-4-7-opus' },
    { name: 'Claude Opus 4.6', value: 'claude-4-6-opus' },
    { name: 'Claude Sonnet 4.6', value: 'claude-4-6-sonnet' },
    { name: 'Claude Haiku 4.5', value: 'claude-4-5-haiku' }
  ],
  openai: [
    { name: 'GPT-6 (Spud)', value: 'gpt-6-preview' },
    { name: 'GPT-5.4 Omni', value: 'gpt-5.4-omni' },
    { name: 'GPT-5.4 mini', value: 'gpt-5.4-mini' },
    { name: 'o3 Reasoning', value: 'o3-preview' },
    { name: 'o1 Frontier', value: 'o1-preview' }
  ],
  groq: [
    { name: 'Llama 4 70B (GroqSpeed)', value: 'llama-4-70b-groq' },
    { name: 'Llama 3.3 70B', value: 'llama-3.3-70b-specdec' },
    { name: 'DeepSeek V3 (Groq)', value: 'deepseek-v3-groq' },
    { name: 'Mixtral 8x22B 64k', value: 'mixtral-8x22b-64k' }
  ],
  openrouter: [
    { name: 'DeepSeek V4 (SWE-Frontier)', value: 'deepseek/deepseek-v4' },
    { name: 'Grok 4.20 (xAI)', value: 'x-ai/grok-4.20' },
    { name: 'Qwen 3.5 122B (OR)', value: 'qwen/qwen-3.5-122b' },
    { name: 'Mistral Small 4', value: 'mistralai/mistral-small-4' }
  ]
};

const updateModelList = (selectedProvider, currentModel, fetchedModels = null) => {
  const modelSelect = document.getElementById('modelSelect');
  const modelCustom = document.getElementById('modelCustom');
  const models = fetchedModels || providerModels[selectedProvider] || [];
  
  modelSelect.innerHTML = '';
  
  models.forEach(model => {
    const option = document.createElement('option');
    option.value = model.value;
    option.textContent = model.name;
    modelSelect.appendChild(option);
  });

  const customOption = document.createElement('option');
  customOption.value = 'custom';
  customOption.textContent = 'Custom Model...';
  modelSelect.appendChild(customOption);

  const exists = models.find(m => m.value === currentModel);
  if (exists) {
    modelSelect.value = currentModel;
    modelCustom.style.display = 'none';
  } else if (currentModel && currentModel !== '') {
    modelSelect.value = 'custom';
    modelCustom.value = currentModel;
    modelCustom.style.display = 'block';
  } else {
    modelSelect.value = models[0]?.value || 'custom';
    if (modelSelect.value === 'custom') modelCustom.style.display = 'block';
  }
};

const autoFetchOpenRouter = async () => {
  const provider = document.getElementById('provider').value;
  const apiKey = document.getElementById('apiKey').value;
  const status = document.getElementById('status');

  if (provider !== 'openrouter' || !apiKey) return;

  status.textContent = 'SYNCING OPENROUTER MODELS...';
  status.style.color = '#E9F284';
  
  try {
    const headers = { 
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://build-design.com',
      'X-Title': 'Build Design AI'
    };

    const response = await fetch('https://openrouter.ai/api/v1/models', { headers });
    const data = await response.json();

    if (data.data && Array.isArray(data.data)) {
      const fetched = data.data.map(m => ({
        name: m.name || m.id,
        value: m.id
      })).sort((a, b) => a.name.localeCompare(b.name));
      
      updateModelList('openrouter', document.getElementById('modelSelect').value, fetched);
      status.textContent = `SYNCED ${fetched.length} MODELS`;
    }
  } catch (err) {
    console.error('Auto-fetch error:', err);
    status.textContent = 'SYNC FAILED (CHECK API KEY)';
    status.style.color = '#ff4444';
  }
  setTimeout(() => {
    status.style.color = '#E9F284';
    if (!status.textContent.includes('FAILED')) status.textContent = '';
  }, 2000);
};

const saveSettings = () => {
  const provider = document.getElementById('provider').value;
  const apiKey = document.getElementById('apiKey').value;
  const modelSelect = document.getElementById('modelSelect').value;
  const modelCustom = document.getElementById('modelCustom').value;
  
  const model = modelSelect === 'custom' ? modelCustom : modelSelect;

  chrome.storage.sync.set({ provider, apiKey, model }, () => {
    const status = document.getElementById('status');
    status.textContent = 'CONFIGURATION SAVED';
    setTimeout(() => { status.textContent = ''; }, 2000);
  });
};

const restoreSettings = () => {
  chrome.storage.sync.get({
    provider: 'nvidia',
    apiKey: '',
    model: 'minimaxai/minimax-m2.7'
  }, (items) => {
    document.getElementById('provider').value = items.provider;
    document.getElementById('apiKey').value = items.apiKey;
    updateModelList(items.provider, items.model);
    if (items.provider === 'openrouter') autoFetchOpenRouter();
  });
};

document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('save').addEventListener('click', saveSettings);

document.getElementById('provider').addEventListener('change', (e) => {
  updateModelList(e.target.value, '');
  if (e.target.value === 'openrouter') autoFetchOpenRouter();
});

document.getElementById('apiKey').addEventListener('blur', () => {
  if (document.getElementById('provider').value === 'openrouter') autoFetchOpenRouter();
});

document.getElementById('modelSelect').addEventListener('change', (e) => {
  const modelCustom = document.getElementById('modelCustom');
  if (e.target.value === 'custom') {
    modelCustom.style.display = 'block';
    modelCustom.focus();
  } else {
    modelCustom.style.display = 'none';
  }
});
