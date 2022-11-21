import { AuthService } from "../../services/index";
import { Store } from "../../state/store";
import {
	InjectionRequest,
	Instances,
	buildRequest,
} from "../../state/injector";

export class ChaosLogout extends HTMLElement {
	private _auth: AuthService;
	private _store: Store;
	private _subscription: string;

	onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		this._auth.unauthenticate();
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this.innerHTML = `<button type="button" class="fill" hidden>Logout</button>`;

		const getAuth = buildRequest(<InjectionRequest>{
			instance: Instances.AUTH,
			callback: (e) => (this._auth = e),
		});

		const getStore = buildRequest(<InjectionRequest>{
			instance: Instances.STORE,
			callback: (e) => (this._store = e),
		});

		this.dispatchEvent(getAuth);
		this.dispatchEvent(getStore);

		this._subscription = this._store.isAuthorized$.subscribe(
			"chaos-panel",
			(isAuth) => {
				this.innerHTML = isAuth
					? `<button type="button" class="fill">Logout</button>`
					: `<button type="button" class="fill" hidden>Logout</button>`;
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
