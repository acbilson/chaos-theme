import AuthService from "../../services/auth-service/index";
import authstore from "../../state/index";

export class ChaosLogout extends HTMLElement {
	private _subscription: string;

	onClick(e: MouseEvent) {
		e.preventDefault();
		AuthService.unauthenticate();
	}

	constructor() {
		super();
	}

	connectedCallback() {
		this._subscription = authstore.isAuthorized$.subscribe(
			"chaos-logout",
			(isAuth) => {
				this.innerHTML = isAuth
					? `<button type="button">Logout</button>`
					: `<button type="button" hidden>Logout</button>`;
			}
		);
		this.addEventListener("click", (e: MouseEvent) => this.onClick(e), false);
	}

	disconnectedCallback() {
		authstore.isAuthorized$.unsubscribe(this._subscription);
		this.removeEventListener(
			"click",
			(e: MouseEvent) => this.onClick(e),
			false
		);
	}
}
