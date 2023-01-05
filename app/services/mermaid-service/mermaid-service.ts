import mermaid from "mermaid/dist/mermaid.esm.mjs";

export class MermaidService {
	api: any;

	constructor() {
		mermaid.initialize({ startOnLoad: false });
		this.api = mermaid.mermaidAPI;
	}
}
