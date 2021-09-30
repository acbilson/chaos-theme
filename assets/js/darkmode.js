function updateMode(mode) {
    document.documentElement.setAttribute('color-mode', mode);
    localStorage.setItem("color-mode", mode);
}

function toggleMode(event) {

    if (event && event.target) {

        const selectedTheme = document.querySelector('#nav-switch option:checked').value;

        if (selectedTheme) {
            updateMode(selectedTheme);

            // manually update comments
            if (window.REMARK42) {
                var theme;
                switch (selectedTheme) {
                    case 'void':
                        theme = 'dark';
                        break;

                    case 'jungle':
                    case 'minimal':
                    default:
                        theme = 'light';
                        break;
                }
                window.REMARK42.changeTheme(theme);
            }
        }
    }
}


const storedTheme = localStorage.getItem('color-mode');

if (storedTheme != null) {
  document.querySelector(`#nav-switch option[value='${storedTheme}']`).selected = true;
}

document.getElementById('nav-switch').addEventListener('change', toggleMode);