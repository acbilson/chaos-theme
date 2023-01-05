import { PublishService, AuthService, MastoAuthService, MermaidService } from "../services/index";
import store from "./index";

export enum Instances {
	PUBLISH = "publish-service",
	AUTH = "auth-service",
	MASTOAUTH = "masto-auth-service",
	STORE = "store-state",
	MERMAID = "mermaid-service",
}

export const InjectorMap = new Map<string, object>([
	[Instances.PUBLISH, new PublishService()],
	[Instances.AUTH, new AuthService()],
	[Instances.MASTOAUTH, new MastoAuthService()],
	[Instances.MERMAID, new MermaidService()],

	// I use the runtime store instead of a new implementation
	// because services have internal dependencies on store and
	// I don't want them to require injection right now
	[Instances.STORE, store],
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
