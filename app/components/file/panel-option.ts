import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChangeOption } from "./models";

@customElement("app-panel-option")
export class PanelOption extends LitElement {
	@property({ attribute: "input-type" })
	inputType: string;

	@property()
	required: boolean;

	@property()
	label: string;

	getModel(): ChangeOption {
		return <ChangeOption>{
			name: this.label.toLowerCase().replaceAll(" ", ""),
			value: this._value,
			required: this.required,
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
					type="${this.inputType}"
				/>
				${this.required
					? html`<span class="required">(required)</span>`
					: html`<span></span>`}
			</div>
		`;
	}
}
