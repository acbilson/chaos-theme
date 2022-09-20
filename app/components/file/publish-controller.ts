import { ReactiveController, ReactiveControllerHost } from "lit";
import { Response, ChangeResult, ReadResult } from "./models";
import { BaseUrls } from "../shared/base-urls";

export class PublishController implements ReactiveController {
	private _host: ReactiveControllerHost;

	read(token: string, filePath: string): Promise<Response<ReadResult>> {
		if (token == null) new Promise(() => null);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL(`file?path=${filePath}`, BaseUrls.publish), {
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ReadResult>>b);
	}

	update(
		token: string,
		payload: ChangeResult
	): Promise<Response<ChangeResult>> {
		if (token == null) new Promise(() => false);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL("file", BaseUrls.publish), {
			method: "PUT",
			body: JSON.stringify(payload),
			headers: { "Content-Type": "application/json; charset=UTF-8" },
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}

	create(
		token: string,
		payload: ChangeResult
	): Promise<Response<ChangeResult>> {
		if (token == null) new Promise(() => false);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL("file", BaseUrls.publish), {
			method: "POST",
			body: JSON.stringify(payload),
			headers: { "Content-Type": "application/json; charset=UTF-8" },
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}

	constructor(host: ReactiveControllerHost) {
		(this._host = host).addController(this);
	}

	hostConnected() {}
	hostDisconnected() {}
}
