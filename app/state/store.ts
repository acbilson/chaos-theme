import { authorized } from "../shared/operators";
import { BaseUrls } from "../shared/base-urls";
import { Notified } from "./notified";
import { Observed } from "./observed";

export class Store {
	// authentication
	public isAuthorized$ = new Observed<boolean>();

	// filtering
	public onFieldFilter$ = new Notified();

	public get token(): string {
		return sessionStorage.getItem("token");
	}

	constructor() {
		// page load sets initial authorized state
		authorized(this.token).then(
			(isAuth) => (this.isAuthorized$.value = isAuth)
		);
	}
}