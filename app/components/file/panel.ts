import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { customElement, property, state } from "lit/decorators.js";
import { Response, ChangeResult, ChangeOption, PanelStatus } from "./models";
import { PanelOption } from "./panel-option";
import { AuthController } from "../auth/auth-controller";
import { PublishController } from "./publish-controller";

@customElement("app-panel")
export class Panel extends LitElement {
	private _auth = new AuthController(this, "app-panel");
	private _pub = new PublishController(this);

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
		if (!slots) return null;
		const optionSlot = Array.from(slots).find((x) => x.slot === "options");
		return <PanelOption[]>(
			Array.from(optionSlot.querySelectorAll("app-panel-option"))
		);
	}

	private get _frontmatter(): object {
		return this._panelOptions?.reduce((prev, curr) => {
			if (curr?.key && curr?.value) {
				prev[curr.key] = curr.value;
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

	updatePanelOptions(path: string, frontmatter: object) {
		const options = this._panelOptions;
		if (!options) return;

		// update path
		const pathOption = options.find((o) => o.key === "path");
		pathOption.value = path;
		pathOption.readonly = true;

		// update front matter options
		Object.keys(frontmatter).forEach((k) => {
			const o = options.find((o) => o.key === k);
			if (o) {
				o.value = frontmatter[k];
			}
		});
	}

	clearPanelOptions() {
		const options = this._panelOptions;
		if (!options) return;
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
		if (!frontmatter) return;
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

	_create() {
		const frontmatter = this._frontmatter;
		if (!frontmatter) return;
		if ("path" in frontmatter == false) {
			this.message = "File path is a required panel option";
			return;
		}

		const path = frontmatter["path"];
		delete frontmatter["path"];
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
		const options = this._panelOptions;
		if (!options) return;
		if (options.filter((x) => x.required).some((x) => !x.value)) {
			this.message = "Not all required fields have values";
			return;
		}

		switch (this.status) {
			case PanelStatus.CREATING:
				this._create();
				break;
			case PanelStatus.EDITING:
				this.updateFile();
				break;
			default:
				console.log(`Not saving, status was ${this.status}`);
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
			return html`<p>Not authorized to view panel</p>`;

		return html`
			<details>
				<summary>Admin Panel</summary>
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
