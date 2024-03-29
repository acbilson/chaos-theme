import { getUrlFromHead } from "../../shared/operators";
import { Response, MastoAuthResult } from "../models";
import store from "../../state/index";

export class MastoAuthService {
	public authenticate(token: string, redirect: string): Promise<string> {
		if (token == null || redirect == null)
			return new Promise((resolve) =>
				resolve("missing authentication arguments")
			);

		const baseUri = getUrlFromHead("authentication");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve("missing authentication uri in head")
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL(`mastodon/auth?redirect=${redirect}`, baseUri), {
			headers,
		})
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

	public unauthenticate(token: string, mastotoken: string): Promise<string> {
		if (token == null || mastotoken == null)
			return new Promise((resolve) =>
				resolve("missing authentication arguments")
			);

		const baseUri = getUrlFromHead("authentication");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve("missing authentication uri in head")
			);

		const payload = { token: mastotoken };
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("mastodon/revoke", baseUri), {
			method: "POST",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((r) => <Response<any>>r)
			.then((r) => {
				if (!r.success) return r.message;
				sessionStorage.removeItem("mastotoken");
				store.isMastodonAuthorized$.value = false;
				return "";
			});
	}
}
