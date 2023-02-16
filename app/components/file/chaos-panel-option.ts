import { Store } from "../../state/store";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";
import {
	ChangeOption,
	PanelOptionType,
	SupportedPanelTypes,
} from "../../services/models";

export class ChaosPanelOption extends HTMLElement {
	private _store: Store;
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

	get inputType(): string {
		switch (this.type) {
			case PanelOptionType.TEXT:
			case PanelOptionType.LIST:
			case PanelOptionType.BOOLEAN:
			default:
				return "text";
			case PanelOptionType.FILE:
				return "file";
		}
	}

	get value(): SupportedPanelTypes {
		const value = this.getAttribute("data-value") || "";

		switch (this.type) {
			case PanelOptionType.TEXT:
			default:
				return value;
			case PanelOptionType.LIST:
				return value.includes(",")
					? value.replaceAll(" ", "").split(",")
					: [value.trim()];
			case PanelOptionType.BOOLEAN:
				return ["true", "yes"].includes(value.toLowerCase());
			case PanelOptionType.FILE:
				return value.substring(12, value.length);
		}
	}

	set value(v: SupportedPanelTypes) {
		this.setAttribute("data-value", String(v));
		if (this.type !== PanelOptionType.FILE) this.input.value = String(v);
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
		return type ? PanelOptionType[type.toUpperCase()] : PanelOptionType.TEXT;
	}

	getModel(): ChangeOption {
		return <ChangeOption>{
			key: this.key,
			name: this.label,
			value: this.value,
			required: this.required,
			type: this.type,
		};
	}

	onEdit(e) {
		e.preventDefault();
		this.value = e.target.value;
	}

	render() {
		return `
			<li class="panel-option spread-btwn${this.required ? " required" : ""}">
				<label for="${this.label}">${this.label}</label>
				<span>${this.required ? "(required)" : ""}
				<input type="${this.inputType}"
					${this.label ? `name="${this.label}"` : ""}
					${this.value ? `value="${this.value}"` : ""}
					${this.readonly ? "disabled" : ""}
					${this.type == PanelOptionType.FILE ? 'accept="image/*"' : ""}
				/></span>
			</li>
		`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		const getStore = buildRequest(<InjectionRequest>{
			instance: Instances.STORE,
			callback: (e) => (this._store = e),
		});

		this.dispatchEvent(getStore);

		this._subscription = this._store.isAuthorized$.subscribe(
			"chaos-panel-option",
			(isAuth) => {
				if (isAuth) {
					this.innerHTML = this.render();
				} else {
					this.innerHTML = `<span hidden>Not authorized to view panel option</span>`;
				}
			}
		);

		this.addEventListener("input", (e) => this.onEdit(e));
	}

	disconnectedCallback() {
		this._store.isAuthorized$.unsubscribe(this._subscription);
		this.removeEventListener("input", (e) => this.onEdit(e));
	}
}
