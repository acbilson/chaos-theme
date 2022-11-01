export class BaseUrls {
	private static _getUrlFromHead(rel: string): string {
		const link = Array.from(document.head.children).find(
			(x) => (x as HTMLAnchorElement).rel === rel
		);
		return (link as HTMLAnchorElement)?.href;
	}

	public static get publish(): string {
		return this._getUrlFromHead("publish");
	}

	public static get auth(): string {
		return this._getUrlFromHead("authentication");
	}
}
