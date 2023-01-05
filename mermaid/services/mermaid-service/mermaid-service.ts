import mermaid from "mermaid/dist/mermaid.min.js";

export class MermaidService {
	api: any;

	constructor() {
		mermaid.initialize({ startOnLoad: false });
		this.api = mermaid.mermaidAPI;
	}
}
