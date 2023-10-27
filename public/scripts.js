let favorites = [];

document.addEventListener('DOMContentLoaded', () => {
  const soundboard = document.getElementById('soundboard');
  const uploadBtn = document.getElementById('upload-btn');
  const popup = document.getElementById('upload-popup');
  const fileInput = document.getElementById('file-input');
  const urlInput = document.getElementById('url-input');

  uploadBtn.addEventListener('click', openPopup);
  fileInput.addEventListener('change', upload);
  urlInput.addEventListener('input', () => fileInput.value = ''); // Clear file input if URL is entered

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
      favBtn.onclick = () => toggleFavorite(sound.file, button);
      button.appendChild(favBtn);
      button.addEventListener('click', () => playSound(sound.file, button));
      soundboard.appendChild(button);
    });
  }

  function renderFavorites() {
    const favoritesContainer = document.getElementById('favorites');
    const list = document.createElement('ul');

    if (favorites.length === 0) {
      const emptyHint = document.createElement('div');
      emptyHint.textContent = 'no favorites yet';
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

  function toggleFavorite(file, button) {
    const index = favorites.indexOf(file);
    if (index === -1) {
      favorites.push(file);
    } else {
      favorites.splice(index, 1);
    }
    renderFavorites();
    button.querySelector('.fav-btn').classList.toggle('toggled');
  }

  renderFavorites();
});

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

    try {
      await fetch('/upload', { method: 'POST', body: formData });
      closePopup();
      loadSounds();
    } catch (error) {
      console.error('Failed to upload file', error);
    }
  }

  function openPopup() {
    popup.style.display = 'block';
  }

  function closePopup() {
    popup.style.display = 'none';
    fileInput.value = ''; // Reset file input
    urlInput.value = ''; // Reset URL input
  }

  loadSounds();
});