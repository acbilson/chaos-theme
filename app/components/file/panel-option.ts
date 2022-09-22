import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ChangeOption } from "./models";

@customElement("app-panel-option")
export class PanelOption extends LitElement {
	@property({ attribute: "input-type" })
	inputType: string;

	@property()
	label: string;

	getModel(): ChangeOption {
		return <ChangeOption>{
			name: this.label,
			value: this._value,
		};
	}

	private get _value(): string {
		const el = this.renderRoot?.querySelector("input") as HTMLInputElement;
		return el?.value ?? null;
	}

	static styles = [
		css`
			.panel-option {
				width: 30%;
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-between;
			}
		`,
	];

	render() {
		return html`
			<div class="panel-option">
				<label for="${this.label}">${this.label}</label>
				<input name="${this.label}" type="${this.inputType}" />
			</div>
		`;
	}
}
