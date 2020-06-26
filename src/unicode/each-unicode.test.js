import { expect } from "chai";
import { eachUnicode } from "./each-unicode.js";

describe("utf16 service", () => {
  const stringSample = "here\uD83D\uDCA9";
  const stringSample2 = "e\uD83D\uDCA9";
  const stringSample3 = "e\uD83D\uDCA9as";
  const stringSample4 = "\uD83D\uDCA9asf";
  const stringSample5 = "\uD83D\uDCA9";

  describe("eachUnicode()", () => {
    it("Should correctly iterate string with poo character at end of string.", () => {
      eachUnicode(
        stringSample,
        (codePoint, string, index) => {
          switch (index) {
          case 0: expect(string).to.be.equal("h"); return;
          case 1: expect(string).to.be.equal("e"); return;
          case 2: expect(string).to.be.equal("r"); return;
          case 3: expect(string).to.be.equal("e"); return;
          case 4: expect(string).to.be.equal("\uD83D\uDCA9"); return;
          }
        }
      );
    });

    it("Should correctly iterate string with poo character at end of string with one character before.", () => {
      eachUnicode(
        stringSample2,
        (codePoint, string, index) => {
          switch (index) {
          case 0: expect(string).to.be.equal("e"); return;
          case 1: expect(string).to.be.equal("\uD83D\uDCA9"); return;
          }
        }
      );
    });

    it("Should correctly iterate string with poo character between the text.", () => {
      eachUnicode(
        stringSample3,
        (codePoint, string, index) => {
          switch (index) {
          case 0: expect(string).to.be.equal("e"); return;
          case 1: expect(string).to.be.equal("\uD83D\uDCA9"); return;
          case 2: expect(string).to.be.equal("a"); return;
          case 3: expect(string).to.be.equal("s"); return;
          }
        }
      );
    });

    it("Should correctly iterate string with poo character at the beginning of string.", () => {
      eachUnicode(
        stringSample4,
        (codePoint, string, index) => {
          switch (index) {
          case 0: expect(string).to.be.equal("\uD83D\uDCA9"); return;
          case 1: expect(string).to.be.equal("a"); return;
          case 2: expect(string).to.be.equal("s"); return;
          case 3: expect(string).to.be.equal("f"); return;
          }
        }
      );
    });

    it("Should correctly iterate string with only poo character.", () => {
      eachUnicode(
        stringSample5,
        (codePoint, string, index) => {
          switch (index) {
          case 0: expect(string).to.be.equal("\uD83D\uDCA9"); return;
          }
        }
      );
    });
  });
});
