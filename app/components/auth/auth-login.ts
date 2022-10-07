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
			<label for="user-text-field">Username:</label>
			<input id="user-text-field" type="email" autocomplete="username"/>
		<input id="password-text-field" type="password" autocomplete="current-password"/>
			<label for="password-text-field">Password:</label>
			<input id="password-text-field" type="password" autocomplete="current-password"/>
			<button @click="${this._authenticate}">Login</button>
			<label>${this.msg}</label>
		`;
	}
}
