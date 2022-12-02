import { BaseUrls } from "../../shared/base-urls";
import { Response, MastoAuthResult } from "../models";
import store from "../../state/index";

export class MastoAuthService {
	public authenticate(token: string): Promise<string> {
		if (token == null)
			return new Promise((resolve) =>
				resolve("missing authentication arguments")
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL("mastoauth", BaseUrls.auth), { headers })
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((r) => <MastoAuthResult>r)
			.then((r) => {
				if (r?.authenticationUri != null) {
					window.open(r.authenticationUri, "_blank");
				} else {
					return `failed to retrieve authentication URI`;
				}
				return "";
			});
	}

	// TODO: revoke token
	public unauthenticate() {
		sessionStorage.removeItem("mastotoken");
		store.isMastodonAuthorized$.value = false;
	}
}
