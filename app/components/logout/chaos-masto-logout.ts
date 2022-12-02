import { MastoAuthService } from "../../services/index";
import { Store } from "../../state/store";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";

export class ChaosMastoLogout extends HTMLElement {
	private _mastoauth: MastoAuthService;
	private _store: Store;
	private _subscription: string;
	private _defaultHTML = `<button type="button" class="fill" hidden>Logout</button>`;

	onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		this._mastoauth.unauthenticate(
			this._store.token,
			this._store.mastodonToken
		);
	}

	constructor() {
		super();
	}

	connectedCallback() {
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

		// TODO: figure out how to subscribe to both authentication observers combineLatest-style
		this._subscription = this._store.isAuthorized$.subscribe(
			"chaos-panel",
			(isAuth) => {
				this.innerHTML = isAuth
					? `<button type="button" class="fill">Logout</button>`
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
