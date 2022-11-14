import { ChangeOption, PanelOptionType } from "./models";

export class ChaosPanelOption extends HTMLElement {
	get key(): string {
		return this.getAttribute("data-key");
	}

	get label(): string {
		return this.getAttribute("data-label");
	}

	get input(): HTMLInputElement {
		return <HTMLInputElement>this.querySelector("input");
	}

	get value(): string {
		return this.getAttribute("data-value") || "";
	}

	set value(v: string) {
		this.setAttribute("data-value", v);
		this.input.value = v;
	}

	get required(): boolean {
		return !!this.getAttribute("data-required");
	}

	get readonly(): boolean {
		return !!this.getAttribute("data-readonly");
	}

	set readonly(v: boolean) {
		this.setAttribute("data-readonly", String(v));
		this.input.readOnly = v;
	}

	get type(): PanelOptionType {
		const type = this.getAttribute("data-type");
		switch (type) {
			case PanelOptionType.TEXT:
			case PanelOptionType.LIST:
			default:
				return PanelOptionType.TEXT;
		}
	}

	valueByType(): string | string[] {
		switch (this.type) {
			case PanelOptionType.TEXT:
			default:
				return this.value;
			case PanelOptionType.LIST:
				return this.value.includes(",")
					? this.value.replaceAll(" ", "").split(",")
					: [this.value.trim()];
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

	static styles = `
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
		`;

	render() {
		const requiredEl = this.required
			? `<span class="required">(required)</span>`
			: "";
		this.innerHTML = `
			<li class="panel-option">
				<label for="${this.label}">${this.label}</label>
				<input
					name="${this.label}"
					type="${this.type}"
					value="${this.value}"
					${this.readonly ? "disabled" : ""}
				/>
				${requiredEl}
			</li>
		`;
	}

	constructor() {
		super();
		this.render();
	}
}
