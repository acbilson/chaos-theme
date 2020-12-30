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
toggle.addEventListener('change', toggleMode);
