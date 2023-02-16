import { getUrlFromHead } from "../../shared/operators";
import { Response, SearchResult, SiteResult } from "../models";
import store from "../../state/index";

export class SearchService {
	query(q: string): Promise<Response<SearchResult[]>> {
		const baseUri = getUrlFromHead("search");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<SearchResult[]>>{
					success: false,
					message: "missing search uri in head",
					content: [],
				})
			);

		const headers = new Headers();
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL(`search?q=${q}`, baseUri), {
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<SearchResult[]>>b);
	}

	sites(): Promise<Response<SiteResult[]>> {
		const baseUri = getUrlFromHead("search");
		if (!baseUri)
			return new Promise((resolve) =>
				resolve(<Response<SiteResult[]>>{
					success: false,
					message: "missing search uri in head",
					content: [],
				})
			);

		const headers = new Headers();
		headers.append("Content-Type", "application/json; charset=UTF-8");
		return fetch(new URL("sites", baseUri), {
			headers,
		})
			.then((r) => (r.status === 200 ? r.json() : null))
			.then((b) => <Response<SiteResult[]>>b);
	}
}
