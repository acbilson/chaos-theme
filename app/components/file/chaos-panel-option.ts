import store from "../../state/index";
import {
	ChangeOption,
	PanelOptionType,
} from "../../services/publish-service/models";

export class ChaosPanelOption extends HTMLElement {
	private _subscription: string;

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
		return PanelOptionType[type];
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

	render() {
		return `
			<li class="panel-option spread-btwn${this.required ? " required" : ""}">
				<label for="${this.label}">${this.label}</label>
				<span>${this.required ? "(required)" : ""}
				<input
					${this.label ? 'name="this.label"' : ""}
					${this.type ? 'type="this.type"' : ""}
					${this.value ? 'value="this.value"' : ""}
					${this.readonly ? "disabled" : ""}
				/></span>
			</li>
		`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this._subscription = store.isAuthorized$.subscribe(
			"chaos-panel",
			(isAuth) => {
				if (isAuth) {
					this.innerHTML = this.render();
				} else {
					this.innerHTML = `<span hidden>Not authorized to view panel option</span>`;
				}
			}
		);
	}

	disconnectedCallback() {
		store.isAuthorized$.unsubscribe(this._subscription);
	}
}
