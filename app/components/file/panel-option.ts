import { LitElement, PropertyValues, TemplateResult, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("app-panel-option")
export class PanelOption extends LitElement {
	@property({ attribute: "input-type" })
	inputType: string;

	@property()
	label: string;

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
