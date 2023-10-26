document.addEventListener('DOMContentLoaded', () => {
  const soundboard = document.getElementById('soundboard');
  const fileInput = document.getElementById('file-input');
  const linksContainer = document.getElementById('links-container');
  const editLinksButton = document.getElementById('edit-links');
  
  let audioElements = {};
  let editMode = false;

  const loadSounds = async () => {
    const response = await fetch('/sounds');
    const sounds = await response.json();
    soundboard.innerHTML = '';
    audioElements = {};
    sounds.forEach(sound => {
      const button = document.createElement('button');
      button.innerText = sound.name;
      button.addEventListener('click', () => playSound(sound.name));
      soundboard.appendChild(button);
      audioElements[sound.name] = new Audio(`/sounds/${sound.file}`);
    });
  };

  const playSound = (name) => {
    const audio = audioElements[name];
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  fileInput.addEventListener('change', async (event) => {
    const files = event.target.files;
    if (files.length === 0) return;

    const formData = new FormData();
    for (const file of files) {
      formData.append('sounds', file);
    }

    await fetch('/upload', {
      method: 'POST',
      body: formData,
    });

    loadSounds();
  });

  loadSounds();

  // External links and edit functionality
  const loadLinks = async () => {
    const response = await fetch('/links');
    const links = await response.json();
    linksContainer.innerHTML = '';
    links.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.innerText = link.name;
      if (editMode) {
        const removeButton = document.createElement('button');
        removeButton.innerText = 'Remove';
        removeButton.addEventListener('click', () => removeLink(link.name));
        a.appendChild(removeButton);
      }
      linksContainer.appendChild(a);
    });
  };

  const removeLink = async (name) => {
    await fetch(`/links/${name}`, { method: 'DELETE' });
    loadLinks();
  };

  editLinksButton.addEventListener('click', () => {
    editMode = !editMode;
    loadLinks();
  });

  loadLinks();
});
