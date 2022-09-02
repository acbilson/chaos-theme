import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("app-panel")
export class Panel extends LitElement {
	static styles = css`
		.panel {
			width: 90%;
		}
	`;

	render() {
		return html`
		<div class="panel">
			<slot></slot>
		</div>
		`;
	}
}

@customElement("app-panels")
export class Panels extends LitElement {
	private _parser = new DOMParser();

	@state()
	asideContents: HTMLCollection = null;

	private getContent(href: string) {
		fetch(href)
			.then((r) => (r.status === 200 ? r.text() : null))
			.then((t) => {
				const pageDOM = this._parser.parseFromString(t, "text/html");
				this.asideContents = pageDOM.querySelector(".h-entry").children;
			});
			console.log({url: href, aside: this.asideContents});
	}

	constructor() {
		super();
		this.addEventListener('backlink-clicked', (e: CustomEvent) => this.getContent(e.detail.href));
	}

	static styles = css`
		.panels {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
		}
	`;

	render() {
		return html`
		<div class="panels">
			<app-panel><slot name="main"></slot></app-panel>
			<app-panel>${ this.asideContents }<slot name="aside"></slot></app-panel>
		</div>
		`;
	}
}
