import { LitElement, PropertyValues, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { BacklinkDetail } from "./models";

@customElement("app-login")
export class Login extends LitElement {
	authenticate() {
		const token = sessionStorage.getItem("token");

		if (token == null) {
			const headers = new Headers();
			headers.append("Authorization", `Basic ${btoa("alex:example")}`);
			fetch("http://localhost:5000/login", { headers })
				.then((r) => (r.status === 200 ? r.json() : null))
				.then((b) => {
					const headers = new Headers();
					headers.append("Authorization", `Bearer ${b.token}`);
					fetch("http://localhost:5000/authenticate", { headers }).then((r) =>
						r.status === 200
							? sessionStorage.setItem("token", b.token)
							: sessionStorage.removeItem("token")
					);
				});
		} else {
			fetch("http://localhost:5000/authenticate", { headers }).then((r) =>
				r.status === 200
					? sessionStorage.setItem("token", b.token)
					: sessionStorage.removeItem("token")
			);
		}
	}

	constructor() {
		super();
	}

	render() {
		return html` <button @click="${this.authenticate()}">Login</button> `;
	}
}

@customElement("app-panels")
export class Panels extends LitElement {
	private _parser = new DOMParser();

	@state()
	asideContents: HTMLElement = null;

	@state()
	authenticated: boolean;

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
		if (token != null) {
			const headers = new Headers();
			headers.append("Authorization", `Bearer ${token}`);
			fetch("http://localhost:5000/authenticate", { headers }).then(
				(r) => (this.authenticated = r.status === 200)
			);
		}
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
		return html`
			<div class="panels">
				<div class="panel"><slot></slot></div>
				<div class="panel">${this.asideContents}</div>
			</div>
		`;
	}
}
