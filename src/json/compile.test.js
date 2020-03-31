// import { expect } from "chai";
import { compile } from "./compile";

describe("compile()", () => {
  it.only("Should be able to compile.", () => {
    compile(`
get -1 + 2 ~= /ab/
    `);
  });
});
