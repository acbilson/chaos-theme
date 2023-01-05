import { MermaidService } from "../services/index";

export enum Instances {
	MERMAID = "mermaid-service",
}

export const InjectorMap = new Map<string, object>([
	[Instances.MERMAID, new MermaidService()],
]);

export interface InjectionRequest {
	instance: Instances;
	callback: Function;
}

export function buildRequest(request: InjectionRequest) {
	return new CustomEvent("chaos-request", {
		bubbles: true,
		composed: true,
		detail: request,
	});
}
