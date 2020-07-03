import { expect } from "chai";

import { bigint } from "./bigint";

describe("bigint()", () => {
  it("should return true if parameter is bigint.", () => {
    expect(bigint(BigInt(10))).to.equal(true);
    expect(bigint(10)).to.equal(false);
  });
});