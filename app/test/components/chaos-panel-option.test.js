import { expect } from "@esm-bundle/chai";
import { fixture } from "../helpers";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";

describe("chaos-panel-option", () => {
	it("builds a component", () => {
		customElements.define("chaos-panel-option", ChaosPanelOption);
		const el = fixture(
			`<chaos-panel-option></chaos-panel-option>`
		);
		expect(el).to.be.an.instanceOf(ChaosPanelOption);
	});
});
