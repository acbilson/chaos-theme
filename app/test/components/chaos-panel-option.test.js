import { expect } from "@esm-bundle/chai";
import { fixture, render } from "../helpers";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";
import { PanelOptionType } from "../../services/publish-service/models";

describe("chaos-panel-option", () => {
	before(() => {
		customElements.define("chaos-panel-option", ChaosPanelOption);
	});

	it("builds a component", () => {
		const el = fixture(`<chaos-panel-option></chaos-panel-option>`);
		expect(el).to.be.an.instanceOf(ChaosPanelOption);
	});

	it("sets props from attrs", () => {
		const expected = {
			key: "testkey",
			label: "testlabel",
			value: "testvalue",
			required: true,
			readonly: true,
		};
		const el = fixture(
			`<chaos-panel-option
				data-key="testkey"
				data-label="testlabel"
				data-value="testvalue"
				data-required="true"
				data-readonly="true"
			></chaos-panel-option>`
		);

		Object.entries(expected).forEach(([k, v]) => expect(el[k]).to.equal(v));
	});

	it("renders required tag", () => {
		const el = fixture(
			`<chaos-panel-option data-required="true"></chaos-panel-option>`
		);
		const html = el.render();
		expect(html).to.contain("required");
	});

	it("disables input when readonly", () => {
		const el = fixture(
			`<chaos-panel-option data-readonly="true"></chaos-panel-option>`
		);
		const content = render(el.render());
		expect(content.querySelector("input").disabled).to.equal(true);
	});

	it("parses list value", () => {
		const expected = ["test", "me", "please"];
		const el = fixture(
			`<chaos-panel-option
				data-type="list"
				data-value="test,me,please"
			></chaos-panel-option>`
		);
		expect(el.valueByType()).to.have.all.members(expected);
	});
});
