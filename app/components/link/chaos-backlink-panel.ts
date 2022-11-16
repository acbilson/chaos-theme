import { BacklinkDetail, BacklinkEvents } from "./models";

export class ChaosBacklinkPanel extends HTMLElement {
	static parser = new DOMParser();
	content: string;

	get visible(): boolean {
		return this.getAttribute("data-visible");
	}

	set visible(v: boolean) {
		this.setAttribute("data-visible", v);
		this.render();
	}

	onBacklinkClicked(e: CustomEvent) {
		const href = e.detail.href;
		fetch(href)
			.then((x) => (x.status === 200 ? x.text() : null))
			.then((x) => {
				if (x === null) return null;
				const pageDOM = this.parser.parseFromString(x, "text/html");
				const contentEl = pageDom.querySelector(".e-content");
				this.content = contentEl.innerHTML;
				this.visible = true;
			});
	}

	render() {
		this.innerHTML =
			this.visible && this.content
				? `
		<aside class="backlink-panel">
			${this.content}
		</aside>`
				: "<span hidden>No panel to see here</span>";
	}

	constructor() {
		super();
		this.render();
	}

	connectedCallback() {
		this.addEventListener(BacklinkEvents.CLICK, (e) =>
			this.onBacklinkClicked(e)
		);
	}

	disconnectedCallback() {
		this.removeEventListener(BacklinkEvents.CLICK, (e) =>
			this.onBacklinkClicked(e)
		);
	}
}
