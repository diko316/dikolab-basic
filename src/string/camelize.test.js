import { expect } from "chai";
import { camelize } from "./camelize";

describe("String camelize()", () => {
  it("Should convert snake-case string to camel-case", () => {
    expect(camelize("diko-abc")).to.equal("dikoAbc");
    expect(camelize("dikoAbcB")).to.equal("dikoAbcB");
    expect(camelize("DikoAbcB")).to.equal("DikoAbcB");
    expect(camelize("diko----test---ni-+)+_)dinaghan")).to.equal("dikoTestNiDinaghan");
    expect(camelize("-diko----test---ni-+)+_)dinaghan")).to.equal("DikoTestNiDinaghan");
    expect(camelize("-diko---ni-+)+_)dinaghan(*()))")).to.equal("DikoNiDinaghan");
  });
});
