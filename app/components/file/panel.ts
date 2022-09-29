import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { customElement, property, state } from "lit/decorators.js";
import {
	Response,
	ChangeResult,
	ChangeOption,
	ReadResult,
	PanelStatus,
} from "./models";
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

	private get _options(): ChangeOption[] {
		const slot = this.renderRoot.querySelector("slot");
		const slots = slot?.assignedElements({ flatten: true });
		if (!slots || slots.length === 0) return [];

		const optionSlot = Array.from(slots).find((x) => x.slot === "options");
		const elements = optionSlot.querySelectorAll("app-panel-option");
		return Array.from(elements).map((x) => {
			const option = <PanelOption>x;
			return option.getModel();
		});
	}
	private get _frontmatter(): object {
		return this._options.reduce((prev, curr) => {
			if (curr?.name && curr?.value) {
				prev[curr.name] = curr.value;
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

	private _startUpdate() {
		this._pub.read(this._auth.token, this._filePath).then(
			(r) => {
				if (r.success) {
					this.editContents = r.result.body;
					this.status = PanelStatus.EDITING;
				} else {
					this.message = r.message;
				}
			},
			(e) => (this.message = e.toString())
		);
	}

	private _startCreate() {
		this.editContents = "";
		this.status = PanelStatus.CREATING;
	}

	private _update() {
		const frontmatter = this._frontmatter;

		this._pub
			.update(this._auth.token, <ChangeResult>{
				path: this._filePath,
				body: this._content,
				frontmatter,
			})
			.then(
				(r) => {
					if (r.success) {
						this.editContents = r.result.body;
					} else {
						this.message = r.message;
					}
				},
				(e) => (this.message = e.toString())
			);
	}

	private _create() {
		const frontmatter = this._frontmatter;
		if ("filepath" in frontmatter == false) {
			this.message = "File path is a required panel option";
			return;
		}

		const filepath = frontmatter["filepath"];
		delete frontmatter["filepath"];

		this._pub
			.create(this._auth.token, <ChangeResult>{
				path: filepath,
				body: this._content,
				frontmatter: frontmatter,
			})
			.then(
				(r) => {
					if (r.success) {
						this.editContents = r.content.body;
					} else {
						this.message = r.message;
					}
				},
				(e) => (this.message = e.toString())
			);
	}

	private _save() {
		// validate
		if (this._options.filter((x) => x.required).some((x) => !x.value)) {
			this.message = "Not all required fields have values";
			return;
		}

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
			.error {
				color: red;
			}
		`,
	];

	private _changeType(e) {
		this.status = PanelStatus[e.target.id];
	}

	private _renderPanelType(): TemplateResult {
		const items = Object.keys(PanelStatus).map((k) => {
			return html`<li
				class="${classMap({ selected: this.status == PanelStatus[k] })}"
			>
				<button id="${k}">${PanelStatus[k]}</button>
			</li>`;
		});
		return html`<ul @click="${this._changeType}" class="panel-types">
			${items}
		</ul>`;
	}

	private _change(e) {
		this.canSave = e.target.value.length > 0;
	}

	private _renderEditor(): TemplateResult {
		return html`<textarea
			@keyup="${this._change}"
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
				${this._renderPanelType()}
				<slot
					name="options"
					?hidden=${this.status !== PanelStatus.CREATING}
				></slot>
				<p class="error" ?hidden="${!this.message}">${this.message}</p>
				${this._renderEditor()}
				<button @click="${this._save}" ?disabled="${!this.canSave}">
					Save
				</button>
			</details>
		`;
	}
}
