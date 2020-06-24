import { expect } from "chai";
import { uncamelize } from "./uncamelize";

describe("String uncamelize()", () => {
  it("Should convert camel-case string to snake-case.", () => {
    expect(uncamelize("dikoAbc")).to.equal("diko-abc");
    expect(uncamelize("DikoAbc")).to.equal("-diko-abc");
    expect(uncamelize("()__+)*&diko-Abc")).to.equal("-diko-abc");
    expect(uncamelize("()__+)*&diko-*((&^Abc--")).to.equal("-diko-abc");
  });

  it("Should convert to snake-case with custom filler.", () => {
    expect(uncamelize("dikoAbc", "+")).to.equal("diko+abc");
    expect(uncamelize("DikoAbc", "==")).to.equal("==diko==abc");
    expect(uncamelize("()__+)*&diko-Abc", "||")).to.equal("||diko||abc");
    expect(uncamelize("()__+)*&diko-*((&^Abc--", "&")).to.equal("&diko&abc");
  });
});
