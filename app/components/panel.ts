import { LitElement, PropertyValues, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

@customElement("app-panels")
export class Panels extends LitElement {
	private _parser = new DOMParser();

	@state()
	asideContents: HTMLElement = null;

	@state()
	editing: boolean;

	get _content() {
		console.log(this.renderRoot?.querySelector("#content"));
		return (
			(this.renderRoot?.querySelector("#content") as HTMLInputElement)?.value ??
			null
		);
	}

	private _getBacklinkContent(detail: BacklinkDetail) {
		fetch(detail.href)
			.then((r) => (r.status === 200 ? r.text() : null))
			.then((t) => {
				const pageDOM = this._parser.parseFromString(t, "text/html");
				this.asideContents = pageDOM.querySelector(".h-entry");
			});
		console.log({
			url: detail.href,
			panel: detail.panel,
			aside: this.asideContents,
		});
	}

	private _edit(e) {
		const fileType = document.location.href.split("/")[3];
		const fileName = document.location.href.split("/")[5];
		fetch(`http://localhost:5000/read?type=${fileType}&name=${fileName}`)
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => {
				const content = b["my_file_content"];
				this.asideContents = content;
				this.editing = true;
			});
	}

	private _update(e) {
		fetch("http://localhost:5000/update", {
			method: "POST",
			body: JSON.stringify({ content: this._content }),
			headers: { "Content-Type": "application/json; charset=UTF-8" },
		}).then((r) => console.log(r));
	}

	constructor() {
		super();
		this.addEventListener("backlink-clicked", (e: CustomEvent) => {
			this._getBacklinkContent(e.detail);
			this.editing = false;
		});
	}

	static styles = [
		css`
			.panels {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
			}

			.panel {
				width: 45%;
			}

			.edit-content {
				width: 100%;
				height: -webkit-fill-available;
			}
		`,
	];

	render() {
		const panneledClassMap = classMap({ panel: this.asideContents !== null });
		const panel = this.editing
			? html`<textarea id="content" class="edit-content">
${this.asideContents}</textarea
			  >`
			: html`<div id="content">${this.asideContents}</div>`;
		return html`
			<div class="panels">
				<div class="${panneledClassMap}"><slot></slot></div>
				<div class="${panneledClassMap}">
					<auth-authorized>
						<button @click="${this._edit}">Edit</button>
						<button @click="${this._update}">Update</button>
					</auth-authorized>
					${panel}
				</div>
			</div>
		`;
	}
}
