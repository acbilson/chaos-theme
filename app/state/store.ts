import { authorized, mastodonAuthorized } from "../shared/operators";
import { Notified } from "./notified";
import { Observed } from "./observed";

export class Store {
	// authentication
	public isAuthorized$ = new Observed<boolean>();
	public isMastodonAuthorized$ = new Observed<boolean>();

	// filtering
	public onFieldFilter$ = new Notified();

	public get token(): string {
		return sessionStorage.getItem("token");
	}

	public get mastodonToken(): string {
		return sessionStorage.getItem("mastotoken");
	}

	constructor() {
		// page load sets initial authorized state
		authorized(this.token).then((isAuth) => {
			this.isAuthorized$.value = isAuth;
		});

		// responds to messages sent from the second window
		window.addEventListener("message", (ev) => {
			const e = <MessageEvent>ev;
			if (e.isTrusted && e.data) {
				const redirect = document.location.href;
				mastodonAuthorized(this.token, e.data, redirect).then((isAuth) => {
					this.isMastodonAuthorized$.value = isAuth;
				});
			}
		});

		// if Mastodon has redirected a code from its OAuth flow, use the code to retrieve a token
		const params = new URLSearchParams(document.location.search);
		if (params.has("code")) {
			// sends code back to original window that made the authorization request
			window.opener.postMessage(params.get("code"), document.location.origin);
			window.close();
		}
	}
}
