import { MastoAuthService } from "../../services/index";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";
import { Store } from "../../state/store";

export class ChaosMastoLogin extends HTMLElement {
	private _mastoauth: MastoAuthService;
	private _store: Store;
	private _subscription: string;
	private _defaultHTML = `
		<button type="button" class="fill" hidden>Login to Mastodon</button>
		<label id="errors"></label>
	`;

	get errors(): HTMLLabelElement {
		return <HTMLLabelElement>this.querySelector("#errors");
	}

	onClick(e: MouseEvent) {
		const target = <HTMLButtonElement>e.target;
		if (target?.type !== "button") return;
		e.preventDefault();
		e.stopPropagation();

		this._mastoauth
			.authenticate(this._store.token)
			.then((msg) => (this.errors.innerText = msg));
	}

	constructor() {
		super();
	}

	connectedCallback() {
		// placeholder
		this.innerHTML = this._defaultHTML;

		this.dispatchEvent(
			buildRequest(<InjectionRequest>{
				instance: Instances.MASTOAUTH,
				callback: (e) => (this._mastoauth = e),
			})
		);

		this.dispatchEvent(
			buildRequest(<InjectionRequest>{
				instance: Instances.STORE,
				callback: (e) => (this._store = e),
			})
		);

		this._subscription = this._store.isAuthorized$.subscribe(
			"chaos-masto-login",
			(isAuth) => {
				this.innerHTML = isAuth
					? `
					<button type="button" class="fill">Login to Mastodon</button>
					<chaos-masto-logout></chaos-masto-logout>
					<label id="errors"></label>
					`
					: this._defaultHTML;
			}
		);

		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		this._store.isAuthorized$.unsubscribe(this._subscription);
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}
