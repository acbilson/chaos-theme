import { expect } from "@esm-bundle/chai";
import { mapClass } from "../../shared/operators";

it("returns a single class attr", () => {
	expect(mapClass(["test"])).to.equal('class="test"');
});

it("returns a multiple class attr", () => {
	expect(mapClass(["test", "me"])).to.equal('class="test me"');
});

it("returns nothing from empty args", () => {
	expect(mapClass([])).to.equal("");
});
