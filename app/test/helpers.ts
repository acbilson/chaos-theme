export function fixture(template, parent = document.createElement("div")) {
	const wrapper = document.createElement("div");
	wrapper.innerHTML = template;
	document.body.appendChild(wrapper);
	return document.body.lastChild.firstChild;
}
