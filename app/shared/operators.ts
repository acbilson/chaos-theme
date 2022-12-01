import { BaseUrls } from "./base-urls";
import { PanelType } from "../services/models";

export function getFilePathByDate(panelType: PanelType): string {
	const prependZero = (x) => (x < 10 ? `0${x}` : x.toString());
	const now = new Date();
	const y = now.getFullYear().toString();
	const m = prependZero(now.getMonth() + 1);
	const d = now.getDate();
	const h = prependZero(now.getHours());
	const mi = prependZero(now.getMinutes());
	const s = prependZero(now.getSeconds());

	return panelType === PanelType.LOG
		? `/logs/${y}/${m}/${y}${m}${d}-${h}${mi}${s}`
		: `/quips/${y}${m}${d}-${h}${mi}${s}`;
}

export function getSimpleDate(now: Date): string {
	const prependZero = (x) => (x < 10 ? `0${x}` : x.toString());
	const y = now.getFullYear();
	const m = prependZero(now.getMonth() + 1);
	const d = now.getDate();
	return [y, m, d].join("-");
}

export function mapClass(args: string[]): string {
	return args?.length > 0 ? `class="${args.join(" ")}"` : "";
}

export function authorized(token: string): Promise<boolean> {
	if (token == null || BaseUrls.auth == null)
		return new Promise((resolve, reject) => resolve(false));

	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	return fetch(new URL("auth", BaseUrls.auth), { headers }).then(
		(r) => {
			if (r.status === 200) {
				sessionStorage.setItem("token", token);
			} else {
				sessionStorage.removeItem("token");
			}
			return r.status === 200;
		},
		(err) => {
			return false;
		}
	);
}

export function authenticate(
	username: string,
	password: string
): Promise<boolean> {
	if (username == null || password == null || BaseUrls.auth == null)
		return new Promise(() => false);

	const headers = new Headers();
	headers.append("Authorization", `Basic ${btoa(username + ":" + password)}`);
	return fetch(new URL("token", BaseUrls.auth), { headers })
		.then((r) => (r.status === 200 ? r.json() : null))
		.then((b) => (b === null ? false : authorized(b?.token)));
}

export function authenticateMastodon(token: string): Promise<any> {
	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	headers.append("Content-Type", "application/json; charset=UTF-8");
	return fetch(new URL("mastoauth", BaseUrls.auth), { headers });
}

export function getMastodonToken(token: string, code: string): Promise<any> {
	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	headers.append("Content-Type", "application/json; charset=UTF-8");
	return fetch(new URL(`masto_redirect?code=${code}`, BaseUrls.auth), {
		headers,
	});
}

export function getUriFromHead(rel: string): string {
	const link = Array.from(document.head.children).find(
		(x) => (x as HTMLAnchorElement).rel === rel
	);
	return (link as HTMLAnchorElement)?.href;
}
