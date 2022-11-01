import { authenticate, authorized } from "../../shared/operators";
import store from "../../state/index";

export class AuthService {
	private _subscription: string;
	private _isAuthorized: boolean;

	public get isAuthorized(): boolean {
		return this._isAuthorized;
	}

	public get token(): string {
		return store.token;
	}

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
}
