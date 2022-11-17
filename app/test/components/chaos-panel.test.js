import { expect } from "@esm-bundle/chai";
import { fixture, render } from "../helpers";
import { ChaosPanel } from "../../components/file/chaos-panel";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";
import { PanelOptionType } from "../../services/publish-service/models";

describe("chaos-panel", () => {
	before(() => {
		customElements.define("chaos-panel-option", ChaosPanelOption);
		customElements.define("chaos-panel", ChaosPanel);
	});

	it("builds a component", () => {
		const el = fixture(`<chaos-panel></chaos-panel>`);
		expect(el).to.be.an.instanceOf(ChaosPanel);
	});

	it("renders nothing if not authorized", () => {
		const el = fixture(`<chaos-panel></chaos-panel>`);
		expect(el.innerHTML).to.equal("");
	});

	it("renders options", () => {
		const el = fixture(
			`<chaos-panel>
				<chaos-panel-option></chaos-panel-option>
			</chaos-panel>`
		);
		const html = el.render();
		expect(html).to.contain("chaos-panel-option");
	});
});
