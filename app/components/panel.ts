import { LitElement, PropertyValues, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property, state } from "lit/decorators.js";
import {
	BacklinkDetail,
	EditPayload,
	EditResponse,
	UpdatePayload,
} from "./models";
import { AuthController } from "../node_modules/chaos-auth/dist/index.modern.js";

@customElement("app-panel")
export class Panel extends LitElement {
	private _auth = new AuthController(this, "app-panel");

	@state()
	asideContents: HTMLElement = null;

	@state()
	editContents: string;

	@state()
	filePath: string;

	@state()
	editing: boolean;

	private get _updatePayload(): string {
		const el = this.renderRoot?.querySelector("#content") as HTMLInputElement;
		const content = el?.value ?? null;
		return JSON.stringify(<UpdatePayload>{
			fileContent: content,
			filePath: this.filePath,
		});
	}

	private get _editPayload(): EditPayload {
		return <EditPayload>{
			fileType: document.location.href.split("/")[3],
			fileName: document.location.href.split("/")[5],
		};
	}

	private _edit(e) {
		const payload = this._editPayload;
		const headers = new Headers();
		console.log(this._auth);
		headers.append("Authorization", `Bearer ${this._auth.token}`);
		fetch(
			`http://localhost:5000/read?type=${payload.fileType}&name=${payload.fileName}`,
			{ headers }
		)
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => {
				const resp = <EditResponse>b;
				console.log(resp);
				this.editContents = resp.fileContent.join("");
				this.filePath = resp.filePath;
				this.editing = true;
			});
	}

	private _update(e) {
		fetch("http://localhost:5000/update", {
			method: "POST",
			body: this._updatePayload,
			headers: { "Content-Type": "application/json; charset=UTF-8" },
		}).then((r) => console.log(r));
	}

	static styles = [
		css`
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
		const panel = this.editing
			? html`<textarea id="content" class="edit-content">
${this.editContents}</textarea
			  >`
			: html`<div class="content">${this.asideContents}</div>`;
		return this._auth.isAuthorized
			? html`
					<aside>
						<div class="buttons">
							<button @click="${this._edit}">Edit</button>
							<button @click="${this._update}">Update</button>
						</div>
						${panel}
					</aside>
			  `
			: html`<p>Not authorized to view panel</p>`;
	}
}
