import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";
import { AuthController } from "./auth-controller";
import authstore from "../state/index";

@customElement("auth-example")
export class AuthExample extends LitElement {
	private _auth = new AuthController(this, "auth-example");

	render() {
		return this._auth.isAuthorized
			? html`<p>I am authorized</p>`
			: html`<p hidden>I am NOT authorized</p>`;
	}
}
