import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

@customElement("app-backlink")
export class Backlink extends LitElement {
	@property()
	href: string;

	@property()
	title: string;

	@property()
	paragraph: number;

	static styles = css`
		.backref {
			text-transform: capitalize;
			text-decoration-line: underline;
			text-decoration-style: double;
		}
	`;

	constructor() {
		super();
		this.addEventListener('click', () => this.backlinkClicked());
	}

	backlinkClicked() {
		console.log("dispatching");
		this.dispatchEvent(
			new CustomEvent('backlink-clicked', {
			detail: <BacklinkDetail>{
				href: this.href,
				panel: 'aside'
			},
			bubbles: true,
			composed: true
		}));
	}

	render() {
		return html`
		<a
			class="backref"
		>${ this.title }</a>
		`;
	}
}
