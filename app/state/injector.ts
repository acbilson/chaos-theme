import { PublishService } from "../services/publish-service/publish-service";
import { AuthService } from "../services/auth-service/auth-service";
import store from "./index";

export enum Instances {
	PUBLISH = "publish-service",
	AUTH = "auth-service",
	STORE = "store-state",
}

export const InjectorMap = new Map<string, object>([
	[Instances.PUBLISH, new PublishService()],
	[Instances.AUTH, new AuthService()],

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
