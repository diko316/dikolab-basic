// import { expect } from "chai";
import { parse } from "./parser";

describe("parse()", () => {
  it.only("Should parse something.", () => {
    parse("1 + ident * 1 ? a : b");
  });
});
