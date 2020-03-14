import { expect } from "chai";
import { Utf } from "./Utf";

describe("Utf", () => {
  const stringSample = "here\uD83D\uDCA9";
  let utf = null;

  before(
    () => {
      utf = new Utf(stringSample);
    }
  );

  describe("Utf.prototype.length", () => {
    it("Should fix character count lost from string to utf conversion.", () => {
      expect(utf.length).to.be.equal(5);
    });
  });

  describe("Utf.prototype.charAt(index)", () => {
    it("Should return correct string found at index position.", () => {
      expect(utf.charAt(4)).to.be.equal("\uD83D\uDCA9");
    });
  });

  describe("Utf.prototype.indexOf(searchValue [, fromIndex])", () => {
    it("Should comply with String.prototype.indexOf(searchValue).", () => {
      expect(utf.indexOf("e\uD83D\uDCA9")).to.be.equal(3);
      expect(utf.indexOf("e")).to.be.equal(1);
      expect(utf.indexOf("\uD83D\uDCA9")).to.be.equal(4);
      expect(utf.indexOf("\uD83D")).to.be.equal(-1);
    });
    it("Should support with String.prototype.indexOf(searchValue, fromIndex).", () => {
      expect(utf.indexOf("", 1)).to.be.equal(1);
      expect(utf.indexOf("", 11)).to.be.equal(5);
      expect(utf.indexOf("", 5)).to.be.equal(5);
      expect(utf.indexOf("", 4)).to.be.equal(4);
      expect(utf.indexOf("e", 2)).to.be.equal(3);
      expect(utf.indexOf("\uD83D")).to.be.equal(-1);
    });
  });

  describe("Utf.prototype.lastIndexOf(searchValue [, fromIndex])", () => {
    it("Should comply with String.prototype.lastIndexOf(searchValue).", () => {
      expect(utf.lastIndexOf("e\uD83D\uDCA9")).to.be.equal(3);
      expect(utf.lastIndexOf("here\uD83D\uDCA9")).to.be.equal(0);
      expect(utf.lastIndexOf(stringSample)).to.be.equal(0);
      expect(utf.lastIndexOf("\uD83D\uDCA9")).to.be.equal(4);
      expect(utf.lastIndexOf("e")).to.be.equal(3);
    });
    it("Should support with String.prototype.indexOf(searchValue [, fromIndex]).", () => {
      expect(utf.lastIndexOf("")).to.be.equal(5);
      expect(utf.lastIndexOf("", 0)).to.be.equal(0);
      expect(utf.lastIndexOf("", 5)).to.be.equal(5);
      expect(utf.lastIndexOf("", 6)).to.be.equal(5);
      expect(utf.lastIndexOf("e", 2)).to.be.equal(1);
      expect(utf.lastIndexOf("e", 3)).to.be.equal(3);
    });
  });

  // it.only("Should create Utf string", () => {
  //   const sample = '\uD83D\uDCA9';
  //   const instance = new Utf(`buang${sample}`);

  //   console.log(
  //     instance,
  //     instance.length
  //   );
  // });
});
