import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { authenticate, authorized } from "../shared/operators";
import { AuthController } from "./auth-controller";

@customElement("auth-login")
export class AuthLogin extends LitElement {
	private _auth = new AuthController(this, "auth-login");

	@state()
	msg = "";

	get _username() {
		return (
			(this.renderRoot?.querySelector("#username") as HTMLInputElement)
				?.value ?? null
		);
	}

	get _password() {
		return (
			(this.renderRoot?.querySelector("#password") as HTMLInputElement)
				?.value ?? null
		);
	}

	private _authenticate() {
		this._auth
			.authenticate(this._username, this._password)
			.then((msg) => this.msg);
	}

	render() {
		return html`
			<label for="username">Username:</label>
			<input id="username" name="username" autocomplete="username" type="text" />
			<label for="password">Password:</label>
			<input id="password" name="password" autocomplete="password" type="password" />
			<button @click="${this._authenticate}">Login</button>
			<label>${this.msg}</label>
		`;
	}
}
