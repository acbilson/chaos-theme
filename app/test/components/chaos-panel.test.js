import { expect } from "@esm-bundle/chai";
import { fixture, render } from "../helpers";
import { ChaosPanel } from "../../components/file/chaos-panel";
import { ChaosPanelOption } from "../../components/file/chaos-panel-option";
import { Observed } from "../../state/observed";

describe("chaos-panel", () => {
	const unsuccessfulRead = {
		success: false,
		content: {
			body: "",
			path: "",
			frontmatter: {},
		},
	};
	const successfulRead = {
		success: true,
		content: {
			body: "this is my test content",
			path: "/plants/writing/how-to-write-online",
			frontmatter: {},
		},
	};

	// Modify these to adjust test parameters and mocks
	const authorized$ = new Observed();
	let readResult = unsuccessfulRead;
	let updateParamsWatcher = { token: undefined, result: undefined };
	const injectorMap = {
		"publish-service": {
			read: (token, path) =>
				new Promise((resolve, reject) => resolve(readResult)),
			update: (token, result) => {
				updateParamsWatcher.token = token;
				updateParamsWatcher.result = result;
				return new Promise((resolve, reject) => resolve(successfulRead));
			},
		},
		"store-state": {
			isAuthorized$: authorized$,
			token: "my-fake-token",
		},
	};

	before(() => {
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

	it("gets frontmatter from options", () => {
		const expectedKeys = ["name", "age"];
		const expectedValues = ["Alex", "34"];
		const el = fixture(
			`<chaos-panel>
				<chaos-panel-option data-key="name" data-value="Alex"></chaos-panel-option>
				<chaos-panel-option data-key="age" data-value="34"></chaos-panel-option>
			</chaos-panel>`
		);
		authorized$.value = true;

		const frontmatter = el.frontmatter;
		expect(Object.keys(frontmatter)).to.have.all.members(expectedKeys);
		expect(Object.values(frontmatter)).to.have.all.members(expectedValues);
	});

	it("gets file path for type", () => {
		const currentYear = new Date().getFullYear();
		const plantEl = fixture(
			`<chaos-panel data-panel-type="plant"></chaos-panel>`
		);
		const logEl = fixture(`<chaos-panel data-panel-type="log"></chaos-panel>`);
		authorized$.value = true;

		expect(plantEl.getFilePath()).to.equal("/");
		expect(logEl.getFilePath()).to.contain(currentYear);
	});

	describe("update logic", () => {
		it("updates content after starting update", async () => {
			const el = fixture(`<chaos-panel></chaos-panel>`);
			authorized$.value = true;
			readResult = successfulRead;

			await el.startUpdate();

			expect(el.contents).to.equal(successfulRead.content.body);
		});

		it("marks panel not new after starting update", async () => {
			const el = fixture(`<chaos-panel></chaos-panel>`);
			authorized$.value = true;
			readResult = successfulRead;

			await el.startUpdate();

			expect(el.isNew).to.equal(false);
		});

		it("makes path readonly after starting update", async () => {
			const el = fixture(
				`<chaos-panel>
				<chaos-panel-option data-key="path"></chaos-panel-option>
			</chaos-panel>`
			);
			authorized$.value = true;
			readResult = successfulRead;

			await el.startUpdate();
			const pathOption = el.querySelector(
				'chaos-panel-option[data-key="path"]'
			);

			expect(pathOption.readonly).to.equal(true);
		});

		it("sets path to current route after starting update", async () => {
			const el = fixture(
				`<chaos-panel>
				<chaos-panel-option data-key="path"></chaos-panel-option>
			</chaos-panel>`
			);
			authorized$.value = true;
			readResult = successfulRead;

			await el.startUpdate();
			const pathOption = el.querySelector(
				'chaos-panel-option[data-key="path"]'
			);

			expect(pathOption.value).to.equal(successfulRead.content.path);
		});

		it("passes along the correct values to update", async () => {
			const el = fixture(
				`<chaos-panel>
				<chaos-panel-option data-key="path" data-value="/plants/writing/how-to-start-writing-online"></chaos-panel-option>
			</chaos-panel>`
			);
			authorized$.value = true;

			await el.startUpdate();
			await el.updateFile();

			expect(updateParamsWatcher.result.body).to.equal(
				successfulRead.content.body
			);
			expect(updateParamsWatcher.result.path).to.equal(
				successfulRead.content.path
			);
			expect(updateParamsWatcher.result.frontmatter).to.have.property(
				"lastmod"
			);
		});
	});
});
