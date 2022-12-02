import { BaseUrls } from "../../shared/base-urls";
import { authorized } from "../../shared/operators";
import { AuthResult } from "../models";
import store from "../../state/index";

export class AuthService {
	public authenticate(username: string, password: string): Promise<string> {
		if (username == null || password == null || BaseUrls.auth == null)
			return new Promise((resolve) =>
				resolve("missing authentication arguments")
			);

		const headers = new Headers();
		headers.append("Authorization", `Basic ${btoa(username + ":" + password)}`);
		return fetch(new URL("token", BaseUrls.auth), { headers })
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((r) => <AuthResult>r)
			.then(
				(r) => {
					if (r?.token === null) return "there was a login error";
					return authorized(r.token).then((isAuthorized) => {
						store.isAuthorized$.value = isAuthorized;
						return "";
					});
				},
				(err) => "there was a login error"
			);
	}

	public unauthenticate() {
		sessionStorage.removeItem("token");
		store.isAuthorized$.value = false;
	}
}
