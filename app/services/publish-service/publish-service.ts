import { getUrlFromHead } from "../../shared/operators";
import { Response, ChangeResult, PhotoResult } from "../models";
import store from "../../state/index";

export class PublishService {
	create(
		token: string,
		payload: ChangeResult
	): Promise<Response<ChangeResult>> {
		if (token == null)
			new Promise((resolve, reject) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "no token passed to create",
				})
			);

		const baseUri = getUrlFromHead("publish");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "missing publish uri in head",
				})
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("file", baseUri), {
			method: "POST",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}

	createPhoto(
		token: string,
		payload: PhotoResult
	): Promise<Response<PhotoResult>> {
		if (token == null)
			new Promise((resolve, reject) =>
				resolve(<Response<PhotoResult>>{
					success: false,
					message: "no token passed to create photo",
				})
			);

		const baseUri = getUrlFromHead("publish");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<PhotoResult>>{
					success: false,
					message: "missing publish uri in head",
				})
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("photo", baseUri), {
			method: "POST",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<PhotoResult>>b);
	}

	read(token: string, filePath: string): Promise<Response<ChangeResult>> {
		if (token == null)
			new Promise((resolve, reject) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "no token passed to read",
				})
			);

		const baseUri = getUrlFromHead("publish");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "missing publish uri in head",
				})
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		return fetch(new URL(`file?path=${filePath}`, baseUri), {
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
			new Promise((resolve, reject) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "no token passed to update",
				})
			);

		const baseUri = getUrlFromHead("publish");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<ChangeResult>>{
					success: false,
					message: "missing publish uri in head",
				})
			);

		const headers = new Headers();
		headers.append("Authorization", `Bearer ${token}`);
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("file", baseUri), {
			method: "PUT",
			body: JSON.stringify(payload),
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<ChangeResult>>b);
	}
}
