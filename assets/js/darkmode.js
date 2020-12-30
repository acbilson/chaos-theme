function updateMode(mode) {
  document.documentElement.setAttribute('color-mode', mode);
  localStorage.setItem("color-mode", mode);
}

function toggleMode(event) {

  if (event && event.target) {

    const checked = event.target.checked;

    if (checked) {
      updateMode('dark');
    } else {
      updateMode('light');
    }
  }
}

const toggle = document.getElementById('mode-switch');

// sets toggle visual to default value
if (localStorage.getItem('color-mode') === 'dark') {
  toggle.checked = true;
}

toggle.addEventListener('change', toggleMode);
