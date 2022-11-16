import AuthService from "../../services/auth-service/index";
import store from "../../state/index";

export class ChaosLogout extends HTMLElement {
	private _subscription: string;

	onClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		AuthService.unauthenticate();
	}

	constructor() {
		super();
		this.innerHTML = `<button type="button" class="fill">Logout</button>`;
	}

	connectedCallback() {
		this._subscription = store.isAuthorized$.subscribe(
			"chaos-logout",
			(isAuth) => {
				this.innerHTML = isAuth
					? `<button type="button" class="fill">Logout</button>`
					: `<button type="button" class="fill" hidden>Logout</button>`;
			}
		);
		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		store.isAuthorized$.unsubscribe(this._subscription);
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}