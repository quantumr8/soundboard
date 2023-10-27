
document.addEventListener('DOMContentLoaded', () => {
  const soundboard = document.getElementById('soundboard');
  const uploadBtn = document.getElementById('upload-btn');
  const popup = document.getElementById('upload-popup');
  const fileInput = document.getElementById('file-input');
  const urlInput = document.getElementById('url-input');
  let favorites = [];

  
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
      const favBtn = document.createElement('button');
      favBtn.innerHTML = '♥';
      favBtn.classList.add('fav-btn');
      if (favorites.includes(sound.file)) {
        favBtn.classList.add('toggled');
      }
      favBtn.onclick = () => toggleFavorite(sound.file, button, event);
      button.appendChild(favBtn);
      button.addEventListener('click', () => playSound(sound.file, button));
      soundboard.appendChild(button);
    });
  }

  function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    favoritesContainer.innerHTML = '';  // Clear the Favorites container
    const list = document.createElement('ul');

    if (favorites.length === 0) {
      const emptyHint = document.createElement('div');
      emptyHint.textContent = 'No favorites';
      emptyHint.classList.add('empty');
      favoritesContainer.appendChild(emptyHint);
    } else {
      favorites.forEach(favorite => {
        const listItem = document.createElement('li');
        listItem.textContent = favorite;
        listItem.addEventListener('click', () => playSound(favorite, listItem));
        list.appendChild(listItem);
      });
      favoritesContainer.appendChild(list);
    }
  }

  function toggleFavorite(file, button, event) {
    event.stopPropagation();
    const index = favorites.indexOf(file);
    if (index === -1) {
      favorites.push(file);
    } else {
      favorites.splice(index, 1);
    }
    renderFavorites();
    button.querySelector('.fav-btn').classList.toggle('toggled');
  }

  function playSound(file, button) {
    const audio = new Audio(`/sounds/${file}`);
    audio.play();
    button.classList.add('playing');
    audio.addEventListener('ended', () => button.classList.remove('playing'));
    audio.addEventListener('pause', () => button.classList.remove('playing'));
  }

  async function upload() {
    const formData = new FormData();
    if (fileInput.files.length > 0) {
      Array.from(fileInput.files).forEach(file => formData.append('sounds', file));
    } else if (urlInput.value) {
      formData.append('url', urlInput.value);
    } else {
      alert('Please select a file or enter a URL');
      return;
    }

    const progressBar = document.getElementById('progress-bar');
    const uploadMessage = document.getElementById('upload-message');
    progressBar.style.width = '0%';
    uploadMessage.style.display = 'none';
  
    try {
      const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
        // For a real progress update, you would need to use XHR instead of fetch
        // as fetch does not yet support progress updates: https://github.com/whatwg/fetch/issues/607
      });
  
      if (response.ok) {
        progressBar.style.width = '100%';
        uploadMessage.textContent = 'File uploaded successfully!';
        uploadMessage.classList.add('success');
        uploadMessage.classList.remove('error');
      } else {
        progressBar.style.width = '100%';
        uploadMessage.textContent = 'Failed to upload file';
        uploadMessage.classList.add('error');
        uploadMessage.classList.remove('success');
      }
    } catch (error) {
      console.error('Failed to upload file', error);
      progressBar.style.width = '100%';
      uploadMessage.textContent = 'Failed to upload file';
      uploadMessage.classList.add('error');
      uploadMessage.classList.remove('success');
    }
  
    uploadMessage.style.display = 'block';
    closePopup();
    loadSounds();
  }

  function openPopup() {
    popup.style.display = 'block';
  }

  function closePopup() {
    popup.style.display = 'none';
    fileInput.value = ''; // Reset file input
    urlInput.value = ''; // Reset URL input
  }

  uploadBtn.addEventListener('click', openPopup);
  fileInput.addEventListener('change', upload);
  urlInput.addEventListener('input', () => fileInput.value = ''); // Clear file input if URL is entered

  renderFavorites();
  loadSounds();
});

