import { expect } from "chai";
import {
  repeat,
  trim,
  trimStart,
  trimEnd,
  padStart,
  padEnd
} from "./format";

describe("String format", () => {
  describe("repeat(subject)", () => {
    it("should repeat string", () => {
      expect(repeat("5", 5)).to.be.equal("555555");
      expect(repeat("5", 1)).to.be.equal("55");
      expect(repeat("5", 0)).to.be.equal("5");
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

  describe("padStart(subject, length [, padString])", () => {
    it("should pad from start of string", () => {
      expect(padStart("buang", 6, " ")).to.be.equal(" buang");
      expect(padStart("buang", 7, "bass")).to.be.equal("babuang");
    });
  });

  describe("padEnd(subject, length [, padString])", () => {
    it("should pad from end of string", () => {
      expect(padEnd("buang", 6, " ")).to.be.equal("buang ");
      expect(padEnd("buang", 7, "exec")).to.be.equal("buangex");
    });
  });
});
