document.addEventListener('DOMContentLoaded', () => {
  const soundboard = document.getElementById('soundboard');
  const fileInput = document.getElementById('file-input');

  fileInput.addEventListener('change', handleFileUpload);

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
      button.textContent = sound.name;
      button.addEventListener('click', () => playSound(sound.file, button));
      soundboard.appendChild(button);
    });
  }

  function playSound(file, button) {
    const audio = new Audio(`/sounds/${file}`);
    audio.play();
    button.classList.add('playing');
    audio.addEventListener('ended', () => {
      button.classList.remove('playing');
    });
    audio.addEventListener('pause', () => {
      button.classList.remove('playing');
    });
}


  async function handleFileUpload(event) {
    const files = Array.from(event.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('sounds', file));
    try {
      await fetch('/upload', { method: 'POST', body: formData });
      loadSounds();
    } catch (error) {
      console.error('Failed to upload files', error);
    }
  }

  loadSounds();
});

function openPopup() {
  document.getElementById('upload-popup').style.display = 'block';
}

function closePopup() {
  document.getElementById('upload-popup').style.display = 'none';
}

async function upload() {
  const fileInput = document.getElementById('file-input');
  const urlInput = document.getElementById('url-input');
  
  if (fileInput.files.length > 0) {
    const formData = new FormData();
    Array.from(fileInput.files).forEach(file => formData.append('sounds', file));
    await fetch('/upload', { method: 'POST', body: formData });
  } else if (urlInput.value) {
    await fetch('/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput.value }),
    });
  } else {
    alert('Please select a file or enter a URL');
    return;
  }
  
  closePopup();
  loadSounds();
}
