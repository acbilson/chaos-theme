import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { AuthController } from "./auth-controller";

@customElement("auth-logout")
export class AuthLogout extends LitElement {
	private _auth = new AuthController(this, "auth-logout");

	private _logout() {
		this._auth.unauthenticate();
	}

	render() {
		return this._auth.isAuthorized
			? html` <button @click="${this._logout}">Logout</button> `
			: html`<span hidden></span>`;
	}
}
