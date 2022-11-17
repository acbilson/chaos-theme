export function fixture(template, parent = document.createElement("div")) {
	parent.innerHTML = template;
	document.body.appendChild(parent);
	return document.body.lastChild.firstChild;
}

export function render(template, parent = document.createElement("template")) {
	parent.innerHTML = template;
	return parent.content;
}
