import { authorized } from "../shared/operators";
import { BaseUrls } from "../shared/base-urls";

export class Observed<T> {
	private _subscribers: Map<string, Function> = new Map<string, Function>();
	private _value: T;

	public get value(): T {
		return this._value;
	}

	public set value(v: T) {
		this._value = v;
		this.notify();
	}

	subscribe(subscriber: string, callback: Function): string {
		const sub = `${subscriber}-${Math.random()}`;
		this._subscribers.set(sub, callback);
		return sub;
	}

	unsubscribe(sub: string) {
		delete this._subscribers[sub];
	}

	notify() {
		this._subscribers.forEach((callback, sub) => callback(this._value));
	}
}

export class AuthStore {
	public isAuthorized$ = new Observed<boolean>();
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
