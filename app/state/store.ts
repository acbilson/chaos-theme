import {
	authorized,
	mastodonAuthorized,
	getUriFromHead,
} from "../shared/operators";
import { BaseUrls } from "../shared/base-urls";
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

	public get publishUri(): string {
		return getUriFromHead("publish");
	}

	public get authUri(): string {
		return getUriFromHead("authentication");
	}

	constructor() {
		// page load sets initial authorized state
		authorized(this.token).then((isAuth) => {
			this.isAuthorized$.value = isAuth;
		});

		// if Mastodon has redirected a code from its OAuth flow, use the code to retrieve a token
		const params = new URLSearchParams(document.location.search);
		if (params.has("code")) {
			const origin = document.location.origin;
			mastodonAuthorized(this.token, params.get("code"), origin).then(
				(isAuth) => {
					this.isMastodonAuthorized$.value = isAuth;
				}
			);
		}
	}
}
