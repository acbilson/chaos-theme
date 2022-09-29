import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChangeOption, PanelOptionType } from "./models";

@customElement("app-panel-option")
export class PanelOption extends LitElement {
	@property()
	key: string;

	@property()
	label: string;

	@property()
	required: boolean;

	@property()
	type: PanelOptionType;

	private get _inputType() {
		switch (this.type) {
			case PanelOptionType.TEXT:
			case PanelOptionType.LIST:
			default:
				return "text";
		}
	}

	private valueByType() {
		switch (this.type) {
			case PanelOptionType.TEXT:
			default:
				return this._value;
			case PanelOptionType.LIST:
				return this._value.includes(",")
					? this._value.replaceAll(" ", "").split(",")
					: [this._value.trim()];
		}
	}

	getModel(): ChangeOption {
		return <ChangeOption>{
			key: this.key,
			name: this.label,
			value: this.valueByType(),
			required: this.required,
			type: this.type,
		};
	}

	private get _value(): string {
		const el = this.renderRoot?.querySelector("input") as HTMLInputElement;
		return el?.value ?? null;
	}

	static styles = [
		css`
			.panel-option {
				width: 50%;
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
			}
			.panel-label {
				white-space: nowrap;
				margin-right: 12px;
			}
			.panel-input {
				width: 100%;
			}
			.required {
				color: red;
				margin-left: 12px;
			}
		`,
	];

	render() {
		return html`
			<div class="panel-option">
				<label class="panel-label" for="${this.label}">${this.label}</label>
				<input
					class="panel-input"
					name="${this.label}"
					type="${this._inputType}"
				/>
				${this.required
					? html`<span class="required">(required)</span>`
					: html`<span></span>`}
			</div>
		`;
	}
}
