export class EndpointService {
	private _getUrlFromHead(rel: string): string {
		const link = Array.from(document.head.children).find(
			(x) => (x as HTMLAnchorElement).rel === rel
		);
		return (link as HTMLAnchorElement)?.href;
	}

	public get publish(): string {
		return this._getUrlFromHead("publish");
	}

	public get auth(): string {
		return this._getUrlFromHead("authentication");
	}
}
