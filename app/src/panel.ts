import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

function authorized(token: string): Promise<boolean> {
	if (token == null) return new Promise(() => false);

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
	const token = sessionStorage.getItem("token");

	return authorized(token).then((isAuthorized) => {
		if (isAuthorized) return true;

		const headers = new Headers();
		headers.append("Authorization", `Basic ${btoa(username + ":" + password)}`);
		return fetch("http://localhost:5000/login", { headers })
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => authorized(b.token));
	});
}

@customElement("app-login")
export class Login extends LitElement {
	private authenticate() {
		return authenticate("alex", "example");
	}

	constructor() {
		super();
	}

	render() {
		return html`
			<label for="username">Username:</label>
			<input name="username" type="text" />
			<label for="password">Password:</label>
			<input name="password" type="password" />
			<button @click="${this.authenticate()}">Login</button>
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
						<div class="panel">Is Authorized ${this.asideContents}</div>
					</div>
			  `
			: html`<div class="panel"><slot></slot></div>`;
	}
}
