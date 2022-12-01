import {
	authenticate,
	authorized,
	authenticateMastodon,
} from "../../shared/operators";
import store from "../../state/index";

export class AuthService {
	public authenticate(username: string, password: string): Promise<string> {
		return authenticate(username, password).then(
			(isAuthenticated) => {
				store.isAuthorized$.value = isAuthenticated;
				return "";
			},
			(err) => {
				return "there was a login error";
			}
		);
	}

	public unauthenticate() {
		sessionStorage.removeItem("token");
		store.isAuthorized$.value = false;
	}

	public authenticateMastodon(): Promise<any> {
		return authenticateMastodon(store.token)
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((r) => window.open(r.authentication_url, "_blank"));
	}
}
