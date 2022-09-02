import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("my-element")
export class MyElement extends LitElement {
	@property()
	version = "STARTING";

	render() {
		return html`
			<p>Welcome to the Lit tutorial!</p>
			<p>This is the ${this.version} code.</p>
		`;
	}
}

@customElement("app-backlink")
export class Backlink extends LitElement {
	@property()
	href: string;

	@property()
	paragraph = 3;

	@state()
	private _name = 'temp';

	static elementTypes: string[] = [
		"h1",
		"h2",
		"h3",
		"h4", // headers
		"p", // paragraphs
		"ol",
		"ul",
		"li", // lists
	];

	static styles = css`
		.backref {
			text-transform: capitalize;
			text-decoration-line: underline;
			text-decoration-style: double;
		}
	`;

	constructor() {
		super();
		this.addEventListener('mouseover', () => console.log('hover-mode'));
	}

	updated(prevProps: PropertyValues<this>) {
		if (prevProps.has('href')) {
			const urlParts = this.href.split("/");
			this._name = urlParts[urlParts.length - 2];
		}
	}

	render() {
		const urlParts = this.href.split("/");
		const name = urlParts[urlParts.length - 2];
		return html`
		<a
			class="backref"
			href="${ this.href }"
		>${ this._name }</a>
		`;
	}
}
