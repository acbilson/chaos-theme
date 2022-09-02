import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("app-backlink")
export class Backlink extends LitElement {
	@property()
	href: string;

	@property()
	paragraph: number;

	@state()
	private _name = 'temp';

	private _parser = null;

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

	_filterElements(elements: Array<HTMLElement>, elementTypes) {
		if (!elements || elements.length < 1) return null;
		const validElements = Array.from(elements).filter((el) =>
			el ? elementTypes.includes(el.localName) : false
		);
		const startIndex = this.paragraph ?? 0;
		const endIndex =
			validElements.length - startIndex > 3
				? startIndex + 3
				: validElements.length;
		return Array.from(validElements).slice(startIndex, endIndex);
	}

	_getPopupContent(href: string) {
		fetch(this.href)
			.then((r) => (r.status === 200 ? r.text() : null))
			.then((t) => {
				if (t === null) return null;
				const pageDOM = this._parser.parseFromString(t, "text/html");
				const contentElement = pageDOM.querySelector(".e-content");
				const filtered = this._filterElements(contentElement.children, Backlink.elementTypes);
				console.log({content: contentElement, filtered: filtered});
			});
	}

	constructor() {
		super();
		this._parser = new DOMParser();
		this.addEventListener('mouseover', () => this._getPopupContent(this.href));
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
