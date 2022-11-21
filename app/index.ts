import { ChaosLogin } from "./components/login/chaos-login";
import { ChaosLogout } from "./components/logout/chaos-logout";
import { ChaosFilter } from "./components/filter/chaos-filter";
import { ChaosResizer } from "./components/resizer/chaos-resizer";
import { ChaosOnThisDay } from "./components/on-this-day/chaos-on-this-day";
import { ChaosColorSwitch } from "./components/color-switch/chaos-color-switch";
import { ChaosPanel } from "./components/file/chaos-panel";
import { ChaosPanelOption } from "./components/file/chaos-panel-option";
import { Injector, InjectionRequest, Instances } from "./state/injector";

const injector = new Injector();

document.addEventListener("chaos-request", (e: CustomEvent) => {
	const request = <InjectionRequest>e.detail;
	injector.get(request);
});

customElements.define("chaos-login", ChaosLogin);
customElements.define("chaos-logout", ChaosLogout);
customElements.define("chaos-filter", ChaosFilter);
customElements.define("chaos-resizer", ChaosResizer);
customElements.define("chaos-on-this-day", ChaosOnThisDay);
customElements.define("chaos-color-switch", ChaosColorSwitch);
customElements.define("chaos-panel", ChaosPanel);
customElements.define("chaos-panel-option", ChaosPanelOption);
