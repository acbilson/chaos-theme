import { expect } from "@esm-bundle/chai";
import { fixture, render } from "../helpers";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";
import { PanelOptionType } from "../../services/models";
import { Observed } from "../../state/observed";

describe("chaos-panel-option", () => {
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
	});

	it("builds a component", () => {
		const el = fixture(`<chaos-panel-option></chaos-panel-option>`);
		expect(el).to.be.an.instanceOf(ChaosPanelOption);
	});

	it("renders unauthorized span if not authorized", () => {
		const el = fixture(`<chaos-panel-option></chaos-panel-option>`);
		authorized$.value = false;
		expect(el.innerHTML).to.contain("Not authorized");
	});

	it("renders input if authorized", () => {
		const el = fixture(`<chaos-panel-option></chaos-panel-option>`);
		authorized$.value = true;
		expect(el.innerHTML).to.contain("input");
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
		authorized$.value = true;
		const html = el.render();
		expect(html).to.contain("required");
	});

	it("disables input when readonly", () => {
		const el = fixture(
			`<chaos-panel-option data-readonly="true"></chaos-panel-option>`
		);
		authorized$.value = true;
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
		expect(el.value).to.have.all.members(expected);
	});

	it("parses boolean value", () => {
		const expected = true;
		const el = fixture(
			`<chaos-panel-option
				data-type="boolean"
				data-value="true"
			></chaos-panel-option>`
		);
		expect(el.value).to.equal(expected);
	});
});
