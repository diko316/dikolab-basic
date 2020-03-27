import { expect } from "chai";
import { parse } from "./parser";

describe("parse()", () => {
  it("Should be able to parse.", () => {
    parse("get 1 * 1, 1 + 1 - 2");
  });
});
