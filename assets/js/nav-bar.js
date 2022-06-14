document.addEventListener("DOMContentLoaded", (e) => {
	const routePage = this.location.pathname.slice(1).split("/")[0];
	const navDropdown = document.getElementById("nav-router");
	const optionToSelect = Array.from(navDropdown.children).find(
		(l) => l.value === routePage
	);
	if (optionToSelect) {
		optionToSelect.selected = true;
	}
});

const buttonEl = document.getElementById("navbar").querySelector("button");

buttonEl.addEventListener("click", (e) => {
	if (e.target.innerText === "MENU") {
		document.querySelector("section").classList.add("hide");

		const menuEls = document.getElementById("navbar").querySelectorAll("div");

		Array.from(menuEls).map((el) => el.classList.add("reveal"));

		e.target.innerText = "HIDE";
	} else {
		document.querySelector("section").classList.remove("hide");

		const menuEls = document.getElementById("navbar").querySelectorAll("div");

		Array.from(menuEls).map((el) => el.classList.remove("reveal"));

		e.target.innerText = "MENU";
	}
});
