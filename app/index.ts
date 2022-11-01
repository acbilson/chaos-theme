import { ChaosLogin } from "./components/login/chaos-login";
import { ChaosLogout } from "./components/logout/chaos-logout";
import { ChaosFilter } from "./components/filter/chaos-filter";
import { ChaosResizer } from "./components/resizer/chaos-resizer";
import { ChaosOnThisDay } from "./components/on-this-day/chaos-on-this-day";
import { ChaosColorSwitch } from "./components/color-switch/chaos-color-switch";

customElements.define("chaos-login", ChaosLogin);
customElements.define("chaos-logout", ChaosLogout);
customElements.define("chaos-filter", ChaosFilter);
customElements.define("chaos-resizer", ChaosResizer);
customElements.define("chaos-on-this-day", ChaosOnThisDay);
customElements.define("chaos-color-switch", ChaosColorSwitch);
