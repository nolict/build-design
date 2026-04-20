const saveSettings = () => {
  const provider = document.getElementById('provider').value;
  const apiKey = document.getElementById('apiKey').value;
  const model = document.getElementById('model').value;

  chrome.storage.sync.set({ provider, apiKey, model }, () => {
    const status = document.getElementById('status');
    status.textContent = 'Settings saved.';
    setTimeout(() => { status.textContent = ''; }, 2000);
  });
};

const restoreSettings = () => {
  chrome.storage.sync.get({
    provider: 'nvidia',
    apiKey: '',
    model: 'neutron'
  }, (items) => {
    document.getElementById('provider').value = items.provider;
    document.getElementById('apiKey').value = items.apiKey;
    document.getElementById('model').value = items.model;
  });
};

document.addEventListener('DOMContentLoaded', restoreSettings);
document.getElementById('save').addEventListener('click', saveSettings);