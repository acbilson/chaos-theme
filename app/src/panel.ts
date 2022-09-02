import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

@customElement("app-panels")
export class Panels extends LitElement {
	private _parser = new DOMParser();

	@state()
	asideContents: HTMLElement = null;

	private getContent(detail: BacklinkDetail) {
		fetch(detail.href)
			.then((r) => (r.status === 200 ? r.text() : null))
			.then((t) => {
				const pageDOM = this._parser.parseFromString(t, "text/html");
				this.asideContents = pageDOM.querySelector(".h-entry");
			});
			console.log({url: detail.href, panel: detail.panel, aside: this.asideContents});
	}

	constructor() {
		super();
		this.addEventListener('backlink-clicked', (e: CustomEvent) => this.getContent(e.detail));
	}

	static styles = css`
		.panels {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
		}
		.panel {
			width: 45%;
		}
	`;

	render() {
		return html`
		<div class="panels">
			<div class="panel"><slot></slot></div>
			<div class="panel">${ this.asideContents }</div>
		</div>
		`;
	}
}
