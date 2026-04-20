const updateUI = (state) => {
  const { isScanning, lastStatus, scanResult, livePreview } = state;
  const statusDiv = document.getElementById('status');
  const previewArea = document.getElementById('previewArea');
  const scanBtn = document.getElementById('scanBtn');
  const stopBtn = document.getElementById('stopBtn');
  const downloadBtn = document.getElementById('downloadBtn');

  statusDiv.textContent = lastStatus;

  if (livePreview) {
    previewArea.style.display = 'block';
    previewArea.textContent = livePreview;
    previewArea.scrollTop = previewArea.scrollHeight;
  } else {
    previewArea.style.display = 'none';
  }

  if (isScanning) {
    scanBtn.style.display = 'none';
    stopBtn.style.display = 'block';
    downloadBtn.style.display = 'none';
  } else if (scanResult) {
    scanBtn.style.display = 'block';
    scanBtn.textContent = 'EXECUTE NEW SCAN';
    stopBtn.style.display = 'none';
    downloadBtn.style.display = 'block';
    previewArea.style.display = 'none';
  } else {
    scanBtn.style.display = 'block';
    scanBtn.textContent = 'EXECUTE SCAN';
    stopBtn.style.display = 'none';
    downloadBtn.style.display = 'none';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['model'], (items) => {
    document.getElementById('activeModel').textContent = items.model || 'NONE';
  });

  chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (response) => {
    if (chrome.runtime.lastError) return;
    updateUI(response);
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'STATUS_UPDATE') {
    const statusDiv = document.getElementById('status');
    const previewArea = document.getElementById('previewArea');
    
    statusDiv.textContent = message.status;
    
    if (message.preview) {
      previewArea.style.display = 'block';
      previewArea.textContent = message.preview;
      previewArea.scrollTop = previewArea.scrollHeight;
    } else if (!message.status.includes('Generating')) {
      previewArea.style.display = 'none';
    }

    if (message.forceRefresh) {
       chrome.runtime.sendMessage({ action: 'GET_STATUS' }, (res) => updateUI(res));
    }
  }
});

document.getElementById('scanBtn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || tab.url.startsWith('chrome://')) {
    document.getElementById('status').textContent = 'Error: Cannot scan this page';
    return;
  }

  chrome.runtime.sendMessage({ action: 'START_FULL_SCAN' }, (response) => {
    if (response?.success) {
      updateUI({ isScanning: true, lastStatus: 'Initializing...', scanResult: null, livePreview: '' });
    }
  });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'STOP_SCAN' }, () => {
    updateUI({ isScanning: false, lastStatus: 'Ready', scanResult: null, livePreview: '' });
  });
});

document.getElementById('downloadBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'DOWNLOAD_RESULT' }, (response) => {
    if (response?.success && response.result) {
      const { content, hostname } = response.result;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DESIGN-${hostname}.md`;
      a.click();
      URL.revokeObjectURL(url);
      updateUI({ isScanning: false, lastStatus: 'Ready', scanResult: null, livePreview: '' });
    }
  });
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});