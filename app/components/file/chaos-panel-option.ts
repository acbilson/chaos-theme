import { Store } from "../../state/store";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";
import { ChangeOption, PanelOptionType } from "../../services/models";

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
		return type ? PanelOptionType[type.toUpperCase()] : PanelOptionType.TEXT;
	}

	valueByType(): string | string[] {
		console.log(this.type);
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
		const getStore = buildRequest(<InjectionRequest>{
			instance: Instances.STORE,
			callback: (e) => (this._store = e),
		});

		this.dispatchEvent(getStore);

		this._subscription = this._store.isAuthorized$.subscribe(
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
		this._store.isAuthorized$.unsubscribe(this._subscription);
	}
}
