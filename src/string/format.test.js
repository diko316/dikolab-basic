import { expect } from "chai";
import {
  repeat,
  stringify,
  trim,
  trimStart,
  trimEnd
} from "./format";

describe("String format", () => {
  describe("repeat(subject)", () => {
    it("should repeat string", () => {
      expect(repeat("5", 5)).to.be.equal("555555");
      expect(repeat("5", 1)).to.be.equal("55");
      expect(repeat("5", 0)).to.be.equal("5");
    });
  });
  describe("stringify(subject)", () => {
    it("should repeat string", () => {
      const date = new Date();
      expect(stringify(5)).to.be.equal("5");
      expect(stringify(true)).to.be.equal("true");
      expect(stringify(date)).to.be.equal("");
    });
  });
  describe("trim(subject)", () => {
    it("should trim string", () => {
      expect(trim(" buang  ")).to.be.equal("buang");
      expect(trim("buang")).to.be.equal("buang");
      expect(trim("   buang\t\r\n")).to.be.equal("buang");
    });
  });
  describe("trimStart(subject)", () => {
    it("should trimStart string", () => {
      expect(trimStart(" buang ")).to.be.equal("buang ");
      expect(trimStart("buang")).to.be.equal("buang");
      expect(trimStart("   buang\t\r\n")).to.be.equal("buang\t\r\n");
    });
  });
  describe("trimEnd(subject)", () => {
    it("should trimEnd string", () => {
      expect(trimEnd(" buang ")).to.be.equal(" buang");
      expect(trimEnd("buang")).to.be.equal("buang");
      expect(trimEnd("   buang\t\r\n")).to.be.equal("   buang");
    });
  });
});
