import { AuthResult, PanelType } from "../services/models";

export function getUrlFromHead(rel: string): string {
	const match = Array.from(document.head.children).find(
		(x) => (x as HTMLAnchorElement).rel === rel
	);
	return (<HTMLAnchorElement>match).href;
}

export function getFilePathByDate(panelType: PanelType): string {
	const prependZero = (x) => (x < 10 ? `0${x}` : x.toString());
	const now = new Date();
	const y = now.getFullYear().toString();
	const m = prependZero(now.getMonth() + 1);
	const d = prependZero(now.getDate());
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
	const d = prependZero(now.getDate());
	return [y, m, d].join("-");
}

export function mapClass(args: string[]): string {
	return args?.length > 0 ? `class="${args.join(" ")}"` : "";
}

export function authorized(token: string): Promise<boolean> {
	const baseUri = getUrlFromHead("publish");
	if (token == null || !baseUri)
		return new Promise((resolve, reject) => resolve(false));

	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	return fetch(new URL("auth", baseUri), { headers }).then(
		(r) => {
			if (r.status !== 200) return false;
			sessionStorage.setItem("token", token);
			return true;
		},
		(err) => {
			return false;
		}
	);
}

export function mastodonAuthorized(
	token: string,
	code: string,
	redirect: string
): Promise<boolean> {
	const baseUri = getUrlFromHead("publish");
	if (!baseUri) return new Promise((resolve, reject) => resolve(false));

	const headers = new Headers();
	headers.append("Authorization", `Bearer ${token}`);
	headers.append("Content-Type", "application/json; charset=UTF-8");
	return fetch(
		new URL(`mastodon/redirect?code=${code}&redirect=${redirect}`, baseUri),
		{
			headers,
		}
	)
		.then((r) => (r.status === 200 ? r.json() : null))
		.then((r) => <AuthResult>r)
		.then(
			(r) => {
				if (r?.token == null) return false;
				sessionStorage.setItem("mastotoken", r.token);
				return true;
			},
			(err) => {
				return false;
			}
		);
}
