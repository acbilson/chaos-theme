export class TestAPI {
	public href: string = "http://test/api";
	public name: string;

	constructor(name: string) {
		this.name = name;
	}
}

export interface InjectRequest {
	instance: InjectionInstance;
	callback: Function;
}

export enum InjectionInstance {
	TEST = "testapi",
}

export class ChaosInject extends HTMLElement {
	render() {
		return `<p>This is an injection test</p>`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		var request = new CustomEvent("chaos-request", {
			bubbles: true,
			composed: true,
			detail: <InjectRequest>{
				instance: InjectionInstance.TEST,
				callback: (e) => console.log(e),
			},
		});
		this.dispatchEvent(request);
		this.innerHTML = this.render();
	}

	disconnectedCallback() {}
}
