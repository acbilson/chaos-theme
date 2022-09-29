import { ReactiveController, ReactiveControllerHost } from "lit";
import { authenticate, authorized } from "../shared/operators";
import authstore from "../state/index";

export class AuthController implements ReactiveController {
	private _host: ReactiveControllerHost;
	private _hostName: string;
	private _subscription: string;
	private _isAuthorized: boolean;

	public get isAuthorized(): boolean {
		return this._isAuthorized;
	}

	public get token(): string {
		return authstore.token;
	}

	public authenticate(username: string, password: string): Promise<string> {
		return authenticate(username, password).then(
			(isAuthenticated) => {
				authstore.isAuthorized$.value = isAuthenticated;
				return "";
			},
			(err) => {
				return "there was a login error";
			}
		);
	}

	public unauthenticate() {
		sessionStorage.removeItem("token");
		authstore.isAuthorized$.value = false;
	}

	constructor(host: ReactiveControllerHost, hostName: string) {
		(this._host = host).addController(this);
		this._hostName = hostName;
	}

	hostConnected() {
		this._subscription = authstore.isAuthorized$.subscribe(
			this._hostName,
			(isAuth) => {
				this._isAuthorized = isAuth;
				this._host.requestUpdate();
			}
		);
	}

	hostDisconnected() {
		authstore.isAuthorized$.unsubscribe(this._subscription);
	}
}
