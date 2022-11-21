import { PublishService } from "../services/publish-service/publish-service";

export enum Instances {
	PUBLISH = "publish-service",
}

export interface InjectionRequest {
	instance: Instances;
	callback: Function;
}

export class Injector {
	private instanceMap = new Map<string, object>();

	private build(instance: Instances) {
		switch (instance) {
			case Instances.PUBLISH:
				return new PublishService();
				break;
			default:
				console.log(`Could not match instance: ${instance}`);
				break;
		}
	}

	private set(instance: Instances) {
		const newInstance = this.build(instance);
		if (newInstance) this.instanceMap[instance] = newInstance;
	}

	get(request: InjectionRequest) {
		if (!this.instanceMap.has(request.instance)) {
			this.set(request.instance);
		}
		request.callback(this.instanceMap[request.instance]);
	}
}
