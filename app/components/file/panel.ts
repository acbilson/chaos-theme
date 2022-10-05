import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import {
	Response,
	ChangeResult,
	ChangeOption,
	PanelStatus,
	PanelType,
} from "./models";
import { PanelOption } from "./panel-option";
import { AuthController } from "../auth/auth-controller";
import { PublishController } from "./publish-controller";

@customElement("app-panel")
export class Panel extends LitElement {
	private _auth = new AuthController(this, "app-panel");
	private _pub = new PublishController(this);

	private _typesWithOptions = [PanelType.PLANT, PanelType.STONE];

	@property({ attribute: "panel-type" })
	panelType: PanelType = PanelType.PLANT;

	@state()
	editContents: string;

	@state()
	canSave: boolean = false;

	@state()
	status: PanelStatus = PanelStatus.CREATING;

	@state()
	message: string;

	private get _panelOptions(): PanelOption[] {
		const slot = this.renderRoot.querySelector("slot");
		const slots = slot?.assignedElements({ flatten: true });
		const optionSlot = Array.from(slots).find((x) => x.slot === "options");
		return optionSlot
			? <PanelOption[]>(
					Array.from(optionSlot.querySelectorAll("app-panel-option"))
			  )
			: [];
	}

	private get _frontmatter(): object {
		return this._panelOptions.length === 0
			? {}
			: this._panelOptions.reduce((prev, curr) => {
					const m = curr.getModel();
					if (m?.key && m?.value) {
						prev[m.key] = m.value;
					}
					return prev;
			  }, {});
	}

	private get _content(): string {
		const el = this.renderRoot?.querySelector("#content") as HTMLInputElement;
		return el?.value ?? null;
	}

	private get _filePath(): string {
		return document.location.pathname;
	}

	private get _shouldHaveOptions(): boolean {
		return this._typesWithOptions.includes(this.panelType);
	}

	updatePanelOptions(path: string, frontmatter: object) {
		if (!this._shouldHaveOptions) return;
		const options = this._panelOptions;

		// update path
		const pathOption = options.find((o) => o.key === "path");
		if (pathOption) {
			pathOption.value = path;
			pathOption.readonly = true;
		}

		// update front matter options
		Object.keys(frontmatter).forEach((k) => {
			const o = options.find((o) => o.key === k);
			if (o) {
				o.value = frontmatter[k];
			}
		});
	}

	clearPanelOptions() {
		if (!this._shouldHaveOptions) return;
		const options = this._panelOptions;
		options.forEach((o) => (o.value = null));
	}

	startUpdate() {
		this._pub.read(this._auth.token, this._filePath).then((r) => {
			if (r.success) {
				this.editContents = r.content.body;
				this.updatePanelOptions(r.content.path, r.content.frontmatter);
				this.status = PanelStatus.EDITING;
			} else {
				this.message = r.message;
			}
		});
	}

	startCreate() {
		this.editContents = "";
		this.clearPanelOptions();
		this.status = PanelStatus.CREATING;
	}

	updateFile() {
		const frontmatter = this._frontmatter;
		frontmatter["lastmod"] = new Date().toISOString();

		this._pub
			.update(this._auth.token, <ChangeResult>{
				path: this._filePath,
				body: this._content,
				frontmatter,
			})
			.then(
				(r) => {
					if (r.success) {
						this.editContents = r.content.body;
						this.message = "success";
					} else {
						this.message = r.message;
					}
				},
				(e) => (this.message = e.toString())
			);
	}

	_getFilePathByDate(): string {
		const prependZero = (x) => (x < 10 ? `0${x}` : x.toString());
		const now = new Date();
		const y = now.getFullYear().toString();
		const m = prependZero(now.getMonth() + 1);
		const d = now.getDate();
		const h = prependZero(now.getHours());
		const mi = prependZero(now.getMinutes());
		const s = prependZero(now.getSeconds());

		return this.panelType === PanelType.LOG
			? `/logs/${y}/${m}/${y}${m}${d}-${h}${mi}${s}`
			: `/quips/${y}${m}${d}-${h}${mi}${s}`;
	}

	_getFilePath(): string {
		switch (this.panelType) {
			case PanelType.PLANT:
			case PanelType.STONE:
			default:
				return this._filePath;
			case PanelType.QUIP:
			case PanelType.LOG:
				return this._getFilePathByDate();
		}
	}

	createFile() {
		const frontmatter = this._frontmatter;

		// sets the path based on type
		let path: string;
		if ("path" in frontmatter) {
			path = frontmatter["path"];
			delete frontmatter["path"];
		} else {
			path = this._getFilePath();
		}

		const now = new Date().toISOString();
		frontmatter["date"] = now;
		frontmatter["lastmod"] = now;

		this._pub
			.create(this._auth.token, <ChangeResult>{
				body: this._content,
				frontmatter,
				path,
			})
			.then(
				(r) => {
					if (r.success) {
						this.editContents = r.content.body;
						this.updatePanelOptions(r.content.path, r.content.frontmatter);
						this.message = "success";
					} else {
						this.message = r.message;
					}
				},
				(e) => (this.message = e.toString())
			);
	}

	saveFile() {
		const options = this._panelOptions.map((x) => x.getModel());
		const missingRequiredValues = options
			.filter((x) => x.required)
			.some((x) => !x.value);

		if (this._shouldHaveOptions && missingRequiredValues) {
			this.message = "Not all required fields have values";
			console.log({ options });
			return;
		}

		switch (this.status) {
			case PanelStatus.CREATING:
				this.createFile();
				break;
			case PanelStatus.EDITING:
				this.updateFile();
				break;
			default:
				this.message = `Not saving, status was ${this.status}`;
				break;
		}
	}

	setStatus(e) {
		const status = PanelStatus[e.target.id];
		switch (status) {
			case PanelStatus.CREATING:
			default:
				this.startCreate();
				break;
			case PanelStatus.EDITING:
				this.startUpdate();
				break;
		}
		this.status = status;
	}

	editing(e) {
		this.canSave = e.target.value.length > 0;
	}

	static styles = [
		css`
			.panel-types {
				list-style: none;
				display: flex;
				flex-flow: row nowrap;
			}
			.selected {
				background-color: blue;
			}
			.edit-content {
				width: 100%;
				height: -webkit-fill-available;
			}
		`,
	];

	renderPanelType(): TemplateResult {
		const items = Object.keys(PanelStatus).map((k) => {
			return html`<li
				class="${classMap({ selected: this.status == PanelStatus[k] })}"
			>
				<button id="${k}">${PanelStatus[k]}</button>
			</li>`;
		});
		return html`<ul @click="${this.setStatus}" class="panel-types">
			${items}
		</ul>`;
	}

	renderEditor(): TemplateResult {
		return html`<textarea
			@keyup="${this.editing}"
			id="content"
			class="edit-content"
		>
${this.editContents}</textarea
		>`;
	}

	render() {
		if (!this._auth.isAuthorized)
			return html`<span hidden>Not authorized to view panel</span>`;

		return html`
			<details>
				<summary>Admin Panel - ${this.panelType}</summary>
				${this.renderPanelType()}
				<slot name="options"></slot>
				<p
					?hidden="${!this.message}"
					style="${styleMap({
						color: this.message === "success" ? "green" : "red",
					})}"
				>
					${this.message}
				</p>
				${this.renderEditor()}
				<button @click="${this.saveFile}" ?disabled="${!this.canSave}">
					Save
				</button>
			</details>
		`;
	}
}
