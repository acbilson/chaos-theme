function updateMode(mode) {
  document.documentElement.setAttribute('color-mode', mode);
  localStorage.setItem("color-mode", mode);
}

function toggleMode(event) {

  if (event && event.target) {

    const checked = event.target.checked;

    if (checked) {
      updateMode('dark');

      // manually update comments
      if (window.REMARK42) {
        window.REMARK42.changeTheme('dark');
      }

    } else {
      updateMode('light');

      // manually update comments
      if (window.REMARK42) {
        window.REMARK42.changeTheme('light');
      }
    }
  }
}

const toggle = document.getElementById('mode-switch');

// sets toggle visual to default value
if (localStorage.getItem('color-mode') === 'dark') {
  toggle.checked = true;
} else {
  toggle.checked = false;
}

toggle.addEventListener('change', toggleMode);
