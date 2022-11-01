import authstore from "../state/index";
import { Notified } from "../state/store";

export class AuthComponent extends HTMLElement {
	protected _subscription: string;
	protected requestUpdate: Notified<boolean>;

	constructor() {
		super();
	}

	connectedCallback() {
		this._subscription = authstore.isAuthorized$.subscribe((isAuth) => {
			this.requestUpdate.notify(isAuth);
		});
	}

	disconnectedCallback() {
		authstore.isAuthorized$.unsubscribe(this._subscription);
	}
}
