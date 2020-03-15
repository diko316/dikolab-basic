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

  describe("Utf.prototype.padStart(targetLength [, padString])", () => {
    it("Should support with String.prototype.padStart(targetLength [, padString]).", () => {
      expect(utf.padStart(7, "a").text).to.be.equal("aa" + stringSample);
      expect(utf.padStart(7, "animal").text).to.be.equal("an" + stringSample);
      expect(utf.padStart(6, "animal").text).to.be.equal("a" + stringSample);
      expect(utf.padStart(6).text).to.be.equal(" " + stringSample);
      expect(utf.padStart(3).text).to.be.equal(stringSample);
      expect(utf.padStart(5).text).to.be.equal(stringSample);
    });
  });

  describe("Utf.prototype.padEnd(targetLength [, padString])", () => {
    it("Should support with String.prototype.padEnd(targetLength [, padString]).", () => {
      expect(utf.padEnd(7, "a").text).to.be.equal(stringSample + "aa");
      expect(utf.padEnd(7, "animal").text).to.be.equal(stringSample + "an");
      expect(utf.padEnd(6, "animal").text).to.be.equal(stringSample + "a");
      expect(utf.padEnd(6).text).to.be.equal(stringSample + " ");
      expect(utf.padEnd(3).text).to.be.equal(stringSample);
      expect(utf.padEnd(5).text).to.be.equal(stringSample);
    });
  });

  describe("Utf.prototype.repeat(count)", () => {
    it("Should support with String.prototype.repeat(count).", () => {
      expect(utf.repeat(2).text).to.be.equal(stringSample + stringSample);
    });
  });

  describe("Utf.prototype.split(separator, limit)", () => {
    it("Should support with String.prototype.separator(separator, limit).", () => {
      expect(utf.split("").length).to.be.equal(5);
      expect(utf.split("", 2).length).to.be.equal(2);
      expect(utf.split("e", 1).length).to.be.equal(1);
      expect(utf.split(/e/, 1).length).to.be.equal(1);
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
