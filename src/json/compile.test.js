// import { expect } from "chai";
import { compile } from "./compile";

describe("compile()", () => {
  it("Should be able to compile.", () => {
    compile(`
set :call(2 + 1 * 3, 2, 3)
    `);
  });
});
