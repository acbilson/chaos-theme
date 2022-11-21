import { expect } from "@esm-bundle/chai";
import { fixture, render } from "../helpers";
import { ChaosPanel } from "../../components/file/chaos-panel";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";
import { Observed } from "../../state/observed";

describe("chaos-panel", () => {
	const authorized$ = new Observed();

	before(() => {
		const injectorMap = {
			"publish-service": {},
			"store-state": {
				isAuthorized$: authorized$,
			},
		};

		document.addEventListener("chaos-request", (e) => {
			const request = e.detail;
			const instance = injectorMap[request.instance];
			request.callback(instance);
		});

		customElements.define("chaos-panel-option", ChaosPanelOption);
		customElements.define("chaos-panel", ChaosPanel);
	});

	it("builds a component", () => {
		const el = fixture(`<chaos-panel></chaos-panel>`);
		expect(el).to.be.an.instanceOf(ChaosPanel);
	});

	it("renders unauthorized span if not authorized", () => {
		const el = fixture(`<chaos-panel></chaos-panel>`);
		authorized$.value = false;
		expect(el.innerHTML).to.contain("Not authorized");
	});

	it("renders form if authorized", () => {
		const el = fixture(`<chaos-panel></chaos-panel>`);
		authorized$.value = true;
		expect(el.innerHTML).to.contain("form");
	});

	it("renders options", () => {
		const el = fixture(
			`<chaos-panel>
				<chaos-panel-option></chaos-panel-option>
			</chaos-panel>`
		);

		authorized$.value = true;

		const html = el.render();
		expect(html).to.contain("chaos-panel-option");
	});
});
