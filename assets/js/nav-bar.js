document.addEventListener('DOMContentLoaded', (e) => {
	const routePage = this.location.pathname.slice(1).split('/')[0];
	const navDropdown = document.getElementById('nav-router');
	const optionToSelect = Array.from(navDropdown.children).find(l => l.value === routePage);
	if (optionToSelect) {
		optionToSelect.selected = true;
	}
});
