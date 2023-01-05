import { Notified } from "./notified";

export class Observed<T> extends Notified {
	protected _value: T;

	public get value(): T {
		return this._value;
	}

	public set value(v: T) {
		this._value = v;
		this.notify();
	}

	public notify() {
		this._subscribers.forEach((callback, sub) => callback(this._value));
	}

	constructor() {
		super();
	}
}
