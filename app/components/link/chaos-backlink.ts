import { BacklinkDetail, BacklinkEvents } from "./models";

export class ChaosBacklink extends HTMLElement {
	get href(): string {
		return this.getAttribute("data-href") || null;
	}

	get title(): string {
		return this.getAttribute("data-title") || "";
	}

	get paragraph(): number {
		return this.getAttribute("data-paragraph") || 0;
	}

	clickBacklink(e: MouseEvent) {
		e.preventDefault();
		this.dispatchEvent(
			new CustomEvent(BacklinkEvents.CLICK, {
				detail: <BacklinkDetail>{
					href: this.href,
					panel: "aside",
				},
				bubbles: true,
				composed: true,
			})
		);
	}

	render() {
		this.innerHTML = `
		<a class="backref">${this.title}</a>
		`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.addEventListener("click", (e) => this.clickBacklink(e));
	}

	disconnectedCallback() {
		this.removeEventListener("click", (e) => this.clickBacklink(e));
	}
}
