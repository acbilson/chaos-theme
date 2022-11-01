import { BaseUrls } from "./base-urls";

export function authorized(token: string): Promise<boolean> {
	if (token == null || BaseUrls.auth == null) return new Promise(() => false);

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
