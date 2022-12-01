import { AuthService } from "../../services/index";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";

export class ChaosLogin extends HTMLElement {
	private _auth: AuthService;

	get username(): HTMLInputElement {
		return <HTMLInputElement>this.querySelector("#username");
	}

	get password(): HTMLInputElement {
		return <HTMLInputElement>this.querySelector("#password");
	}

	get errors(): HTMLLabelElement {
		return <HTMLLabelElement>this.querySelector("#errors");
	}

	onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		const id = (<HTMLButtonElement>e.target).id;

		switch (id) {
			case "login":
				this._auth
					.authenticate(this.username?.value, this.password?.value)
					.then((msg) => (this.errors.innerText = msg));
				break;

			case "mastodon":
				this._auth.authenticateMastodon().then((r) => console.log(r));
				break;

			default:
				console.log(`button with id ${id} not supported`);
		}
	}

	render() {
		this.innerHTML = `
			<label for="username">Username:</label>
			<input
				id="username"
				name="username"
				autocomplete="username"
				type="text"
			/>
			<label for="password">Password:</label>
			<input
				id="password"
				name="password"
				autocomplete="password"
				type="password"
			/>
			<button id="login" type="button">Login</button>
			<chaos-logout><p>No logout</p></chaos-logout>
			<button id="mastodon" type="button">Authenticate Mastodon</button>
			<label id="errors"></label>
			`;
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.render();

		const getAuth = buildRequest(<InjectionRequest>{
			instance: Instances.AUTH,
			callback: (e) => (this._auth = e),
		});
		this.dispatchEvent(getAuth);

		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}
