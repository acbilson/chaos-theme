import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("app-panel")
export class Panel extends LitElement {
	@property()
	href: string;

	constructor() {
		super();
		// TODO: listen for a custom backlink event
		this.addEventListener('mouseover', (e) => console.log(e));
	}

	static styles = css`
		.panel {
			width: 50%;
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
	static styles = css`
		.panels { }
	`;

	render() {
		return html`
		<div class="panels">
			<slot name="main"></slot>
			<slot name="aside"></slot>
		</div>
		`;
	}
}
