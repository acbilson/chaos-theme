import endpointService from "../endpoint-service/index";
import { Response, ChangeResult } from "./models";

export class PublishService {
	create(
		token: string,
		payload: ChangeResult
	): Promise<Response<ChangeResult>> {
		if (token == null)
			new Promise(
				() =>
					<Response<ChangeResult>>{
						success: false,
						message: "no token retrieved for update",
					}
			);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("file", endpointService.publish), {
			method: "POST",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}

	read(token: string, filePath: string): Promise<Response<ChangeResult>> {
		if (token == null) new Promise(() => null);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL(`file?path=${filePath}`, endpointService.publish), {
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}
	update(
		token: string,
		payload: ChangeResult
	): Promise<Response<ChangeResult>> {
		if (token == null)
			new Promise(
				() =>
					<Response<ChangeResult>>{
						success: false,
						message: "no token retrieved for update",
					}
			);
		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("file", endpointService.publish), {
			method: "PUT",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}
}
