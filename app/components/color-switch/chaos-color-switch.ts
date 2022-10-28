export class ChaosColorSwitch extends HTMLElement {
	private themes = {
		Minimal: "minimal",
		Jungle: "jungle",
		Fall: "fall",
		Void: "void",
	};

	get theme(): string {
		return localStorage.getItem("theme") || this.themes["minimal"];
	}

	set theme(val: string) {
		localStorage.setItem("theme", val);
		document.documentElement.setAttribute("theme", val);
	}

	get themeSelector(): HTMLSelectElement {
		return this.querySelector("select") as HTMLSelectElement;
	}

	get themeOptions(): HTMLOptionElement[] {
		return Array.from(this.themeSelector.options) as HTMLOptionElement[];
	}

	constructor() {
		super();
	}

	onThemeChange(e: InputEvent) {
		console.log("changing theme");
		const select = e.target as HTMLSelectElement;
		this.theme = select.options[select.selectedIndex].value;
	}

	render() {
		const options = Object.entries(this.themes).map(
			([k, v]) => `<option value=${v}>${k}</option>`
		);

		this.innerHTML = `
		<select>
			${options}
		</select>
		`;
	}

	connectedCallback() {
		console.log("rendering");
		this.render();
		this.addEventListener(
			"change",
			(e: InputEvent) => this.onThemeChange(e),
			false
		);

		console.log(`current theme is ${this.theme}`);
		// sets the selector to initial attribute value
		this.themeSelector.selectedIndex = this.themeOptions.findIndex(
			(x) => x.value === this.theme
		);

		// sets global value for when it's only in local storage
		document.documentElement.setAttribute("theme", this.theme);
	}

	disconnectedCallback() {
		this.removeEventListener(
			"change",
			(e: InputEvent) => this.onThemeChange(e),
			false
		);
	}
}
