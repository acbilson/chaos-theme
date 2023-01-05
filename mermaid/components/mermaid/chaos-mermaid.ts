import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";
import { MermaidService } from "../../services/mermaid-service/mermaid-service";

export class ChaosMermaid extends HTMLElement {
	private _mermaid: MermaidService;
	private _subscription: string;
	private markup: string;

	get content(): HTMLElement {
		return <HTMLElement>this.shadowRoot.querySelector(".content");
	}

	constructor() {
		super();
		// joins all Mermaid markup text into a single string
		const getMarkupString = () =>
			Array.from(this.childNodes)
				.filter((node) => node.nodeType === this.TEXT_NODE)
				.map((node) => node.textContent?.trim())
				.join("");

		const buildTemplate = (content: string) => {
			const t = document.createElement("template");
			t.innerHTML = `
				<style>
					.container {
						margin-top: var(--flow-space, 1em);
					}

					pre {
						margin: 0;
					}
				</style>
				<div class="container">
					<pre class="content"></pre>
				</div>
			`;
			return t;
		};

		this.markup = getMarkupString();
		this.attachShadow({ mode: "open" });
		if (this.markup) {
			this.shadowRoot.appendChild(
				buildTemplate(this.markup).content.cloneNode(true)
			);
		}
	}

	connectedCallback() {
		this.dispatchEvent(
			buildRequest(<InjectionRequest>{
				instance: Instances.MERMAID,
				callback: (e) => (this._mermaid = e),
			})
		);

		this._mermaid.api.render("mermaid-diagram", this.markup, (svg) => {
			if (this.shadowRoot) {
				this.content.innerHTML = svg;
			}
		});
	}
}
