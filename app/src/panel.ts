import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

function authorized(token: string): Promise<boolean> {
	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	return fetch("http://localhost:5000/authenticate", { headers }).then(
		(r) => {
			if (r.status === 200) {
				sessionStorage.setItem("token", token);
			} else {
				sessionStorage.removeItem("token");
			}
			return r.status === 200;
		},
		(err) => {
			alert("Try logging in again");
			return false;
		}
	);
}

function authenticate(username: string, password: string): Promise<boolean> {
	if (!username || !password) return new Promise(() => false);
	const headers = new Headers();
	headers.append("Authorization", `Basic ${btoa(username + ":" + password)}`);
	return fetch("http://localhost:5000/login", { headers })
		.then((r) => (r.status === 200 ? r.json() : null))
		.then((b) => (b === null ? false : authorized(b?.token)));
}

@customElement("app-login")
export class Login extends LitElement {
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
		authenticate(this._username, this._password).then(
			(isAuthenticated) => {
				this.msg = isAuthenticated ? "" : "login failed";
			},
			(err) => console.log("there was an error")
		);
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<label for="username">Username:</label>
			<input id="username" name="username" type="text" />
			<label for="password">Password:</label>
			<input id="password" name="password" type="password" />
			<button @click="${this._authenticate}">Login</button>
			<label>${this.msg}</label>
		`;
	}
}

@customElement("app-panels")
export class Panels extends LitElement {
	private _parser = new DOMParser();

	@state()
	isAuthorized: boolean;

	@state()
	asideContents: HTMLElement = null;

	private getContent(detail: BacklinkDetail) {
		fetch(detail.href)
			.then((r) => (r.status === 200 ? r.text() : null))
			.then((t) => {
				const pageDOM = this._parser.parseFromString(t, "text/html");
				this.asideContents = pageDOM.querySelector(".h-entry");
			});
		console.log({
			url: detail.href,
			panel: detail.panel,
			aside: this.asideContents,
		});
	}

	constructor() {
		super();
		this.addEventListener("backlink-clicked", (e: CustomEvent) =>
			this.getContent(e.detail)
		);
		const token = sessionStorage.getItem("token");
		authorized(token).then((isAuthorized) => {
			this.isAuthorized = isAuthorized;
			this.requestUpdate();
		});
	}

	static styles = css`
		.panels {
			display: flex;
			flex-flow: row nowrap;
			justify-content: space-between;
		}
		.panel {
			width: 45%;
		}
	`;

	render() {
		return this.isAuthorized
			? html`
					<div class="panels">
						<div class="panel"><slot></slot></div>
						<div class="panel">${this.asideContents}</div>
					</div>
			  `
			: html`<div class="panel"><slot></slot></div>`;
	}
}
