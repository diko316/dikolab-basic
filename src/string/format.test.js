import { expect } from "chai";
import {
  repeat,
  stringify
} from "./format";

describe("String format", () => {
  describe("repeat(subject)", () => {
    it.only("should repeat string", () => {
      expect(repeat("5", 5)).to.be.equal("555555");
      expect(repeat("5", 1)).to.be.equal("55");
      expect(repeat("5", 0)).to.be.equal("5");
    });
  });
  describe("stringify(subject)", () => {
    it.only("should repeat string", () => {
      const date = new Date();
      expect(stringify(5)).to.be.equal("5");
      expect(stringify(true)).to.be.equal("true");
      expect(stringify(date)).to.be.equal(date.toString());
    });
  });
});
