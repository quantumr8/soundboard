
document.addEventListener('DOMContentLoaded', () => {
  const soundboard = document.getElementById('soundboard');
  const uploadBtn = document.getElementById('upload-btn');
  const popup = document.getElementById('upload-popup');
  const fileInput = document.getElementById('file-input');
  const fileNameSpan = document.getElementById('file-name');
  const fileSizeSpan = document.getElementById('file-size');
  const renameInput = document.getElementById('rename-input');
  const confirmUploadBtn = document.getElementById('confirm-upload-btn'); // Make sure to add this button in your HTML
  const uploadMessage = document.getElementById('upload-message'); // Make sure to add a span or div with this id in your HTML to display upload messages
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPopup = document.getElementById('settings-popup');
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  let selectedFile = null;

  
  async function loadSounds() {
    try {
      const response = await fetch('/sounds');
      const sounds = await response.json();
      renderButtons(sounds);
    } catch (error) {
      console.error('Failed to load sounds', error);
    }
  }

  function renderButtons(sounds) {
    soundboard.innerHTML = '';
    sounds.forEach(sound => {
      const button = document.createElement('button');
      const textSpan = document.createElement('span');
      textSpan.textContent = sound.name;
      button.appendChild(textSpan);
      button.addEventListener('click', () => playSound(sound.file, button));
      soundboard.appendChild(button);
    });
  }

  function playSound(file, button) {
    const audio = new Audio(`/sounds/${file}`);
    audio.play();
    button.classList.add('playing');
    audio.addEventListener('ended', () => button.classList.remove('playing'));
    audio.addEventListener('pause', () => button.classList.remove('playing'));
  }

  settingsBtn.addEventListener('click', () => {
    settingsPopup.style.display = settingsPopup.style.display === 'none' ? 'block' : 'none';
  });

  themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
      body.classList.add('halloween-theme');
    } else {
      body.classList.remove('halloween-theme');
    }
  });
  
  async function upload() {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    const fileName = renameInput.value.trim() || selectedFile.name;
    formData.append('sounds', selectedFile, fileName);
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        // For a real progress update, you would need to use XHR instead of fetch
        // as fetch does not yet support progress updates: https://github.com/whatwg/fetch/issues/607
      });
  
      if (response.ok) {
        uploadMessage.textContent = 'File uploaded successfully!';
        uploadMessage.classList.add('success');
        uploadMessage.classList.remove('error');
      } else {
        uploadMessage.textContent = 'Failed to upload file';
        uploadMessage.classList.add('error');
        uploadMessage.classList.remove('success');
      }
    } catch (error) {
      console.error('Failed to upload file', error);
      uploadMessage.textContent = 'Failed to upload file';
      uploadMessage.classList.add('error');
      uploadMessage.classList.remove('success');
    }
  
    uploadMessage.style.display = 'block';
    closePopup();
    loadSounds();
  }

  function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
      selectedFile = files[0];
      fileNameSpan.textContent = `File Name: ${selectedFile.name}`;
      fileSizeSpan.textContent = `File Size: ${formatBytes(selectedFile.size)}`;
      renameInput.value = '';
    }
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  function openPopup() {
    popup.style.display = 'block';
  }

  function closePopup() {
    popup.style.display = 'none';
    fileInput.value = ''; // Reset file input
  }

  fileInput.addEventListener('change', handleFileSelect);
  confirmUploadBtn.addEventListener('click', upload);
  uploadBtn.addEventListener('click', openPopup);
  
  loadSounds();
});
