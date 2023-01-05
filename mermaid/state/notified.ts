export class Notified {
	protected _subscribers: Map<string, Function> = new Map<string, Function>();

	public subscribe(subscriber: string, callback: Function): string {
		const sub = `${subscriber}-${Math.random()}`;
		this._subscribers.set(sub, callback);
		return sub;
	}

	public unsubscribe(sub: string) {
		delete this._subscribers[sub];
	}

	public notify() {
		this._subscribers.forEach((callback, sub) => callback());
	}
}
