import { expect } from "chai";

import { date } from "./date";

describe("date()", () => {
  it("should return true if parameter is date.", () => {
    expect(date(new Date())).to.equal(true);
    expect(date(false)).to.equal(false);
    expect(date(/abc/)).to.equal(false);
  });
});