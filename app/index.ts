import { ChaosLogin } from "./components/login/chaos-login";
import { ChaosLogout } from "./components/logout/chaos-logout";
import { ChaosMastoLogin } from "./components/login/chaos-masto-login";
import { ChaosMastoLogout } from "./components/logout/chaos-masto-logout";
import { ChaosFilter } from "./components/filter/chaos-filter";
import { ChaosResizer } from "./components/resizer/chaos-resizer";
import { ChaosOnThisDay } from "./components/on-this-day/chaos-on-this-day";
import { ChaosColorSwitch } from "./components/color-switch/chaos-color-switch";
import { ChaosPanel } from "./components/file/chaos-panel";
import { ChaosPanelOption } from "./components/file/chaos-panel-option";
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

customElements.define("chaos-login", ChaosLogin);
customElements.define("chaos-logout", ChaosLogout);
customElements.define("chaos-masto-login", ChaosMastoLogin);
customElements.define("chaos-masto-logout", ChaosMastoLogout);
customElements.define("chaos-filter", ChaosFilter);
customElements.define("chaos-resizer", ChaosResizer);
customElements.define("chaos-on-this-day", ChaosOnThisDay);
customElements.define("chaos-color-switch", ChaosColorSwitch);
customElements.define("chaos-panel", ChaosPanel);
customElements.define("chaos-panel-option", ChaosPanelOption);
