import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { Response, ChangeResult, ReadResult, PanelStatus } from "./models";
import { AuthController } from "../auth/auth-controller";
import { PublishController } from "./publish-controller";

@customElement("app-panel")
export class Panel extends LitElement {
	private _auth = new AuthController(this, "app-panel");
	private _pub = new PublishController(this);

	@state()
	editContents: string;

	@state()
	filePath: string;

	@state()
	status: PanelStatus;

	private get _changeResult(): ChangeResult {
		const el = this.renderRoot?.querySelector("#content") as HTMLInputElement;
		const content = el?.value ?? null;
		return <ChangeResult>{
			filePath: this.filePath,
			content: content,
		};
	}

	private get _filePath(): string {
		return document.location.pathname;
	}

	private _startUpdate() {
		this._pub.read(this._auth.token, this._filePath).then((r) => {
			this.editContents = r.result.content;
			this.filePath = r.result.filePath;
			this.status = PanelStatus.EDITING;
		});
	}

	private _startCreate() {
		this.editContents = "";
		this.filePath = "";
		this.status = PanelStatus.CREATING;
	}

	private _update() {
		this._pub.update(this._auth.token, this._changeResult).then((r) => {
			if (r.result?.filePath != null && r.result?.content != null) {
				this.editContents = r.result.content;
			}
		});
	}

	private _create() {
		this._pub.create(this._auth.token, this._changeResult).then((r) => {
			if (r.result?.filePath != null && r.result?.content != null) {
				this.editContents = r.result.content;
			}
		});
	}

	private _save() {
		switch (this.status) {
			case PanelStatus.CREATING:
				this._create();
				break;
			case PanelStatus.EDITING:
				this._update();
				break;
			default:
				console.log(`Not saving, status was ${this.status}`);
				break;
		}
	}

	static styles = [
		css`
			.edit-content {
				width: 100%;
				height: -webkit-fill-available;
			}
		`,
	];

	private _renderBtns(): TemplateResult {
		const saveBtn =
			this.status === PanelStatus.BLANK
				? html`<span hidden>Not editing</span>`
				: html`<button @click=${this._save}>Save</button>`;

		return html`<div class="buttons">
					<button @click="${this._startUpdate}">Update</button>
					<button @click="${this._startCreate}>Create</button>
					${saveBtn}
				</div>`;
	}

	private _renderConfig(): TemplateResult {
		const pathInput =
			this.status === PanelStatus.BLANK
				? html`<span hidden>Not editing</span`
				: html`<input id="file-path" type="text" value="${this.filePath}" />`;

		return html`<div class="config">${pathInput}</div>`;
	}

	private _renderEditor(): TemplateResult {
		return this.status === PanelStatus.BLANK
			? html`<span hidden>Nothing to edit</span>`
			: html`<textarea id="content" class="edit-content">
${this.editContents}</textarea
			  >`;
	}

	render() {
		if (!this._auth.isAuthorized)
			return html`<p>Not authorized to view panel</p>`;

		return html`
			<aside>
				${this._renderBtns()} ${this._renderConfig()} ${this._renderEditor()}
			</aside>
		`;
	}
}
