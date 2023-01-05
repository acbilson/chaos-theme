import { ChaosMermaid } from "./components/mermaid/chaos-mermaid";
import { InjectorMap, InjectionRequest, Instances } from "./state/injector";

// poor man's dependency injection. Singleton objects are instantiated
// at runtime into the InjectorMap without reflection.
// Must be created prior to custom elements because they emit events
// to retrieve their dependencies from the injector
document.addEventListener("chaos-request", (e: CustomEvent) => {
	const request = <InjectionRequest>e.detail;
	const instance = InjectorMap.get(request.instance);
	request.callback(instance);
});

customElements.define("chaos-mermaid", ChaosMermaid);
