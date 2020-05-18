import { expect } from "chai";
import { tokenize } from "./tokenizer";

describe("tokenize()", () => {
  it("Should tokenize identifier.", () => {
    expect(tokenize("abc.")).to.deep.equal(["ident", "abc", 3, 0]);
    expect(tokenize("d90jkjx+*")).to.deep.equal(["ident", "d90jkjx", 7, 0]);
  });

  it("Should tokenize number.", () => {
    expect(tokenize("1")).to.deep.equal(["integer", "1", 1, 0]);
    expect(tokenize("+100")).to.deep.equal(["+", "+", 1, 0]);
    expect(tokenize("+100", 1)).to.deep.equal(["integer", "100", 4, 0]);
    expect(tokenize("-100")).to.deep.equal(["-", "-", 1, 0]);

    expect(tokenize("0.1 +")).to.deep.equal(["float", "0.1", 3, 0]);
    expect(tokenize("+0.1 +", 1)).to.deep.equal(["float", "0.1", 4, 0]);
    expect(tokenize("-0.1 +", 1)).to.deep.equal(["float", "0.1", 4, 0]);
    expect(tokenize("0.1x")).to.deep.equal(["float", "0.1", 3, 0]);

    expect(tokenize("0.5% ni")).to.deep.equal(["percent", "0.5%", 4, 0]);
  });

  it("Should tokenize quoted string.", () => {
    expect(tokenize("'buang ka'")).to.deep.equal(["string", "\"buang ka\"", 10, 0]);
    expect(tokenize("'buang\\' ka'")).to.deep.equal(["string", "\"buang' ka\"", 12, 0]);
  });

  it("Should tokenize parenthesis.", () => {
    expect(tokenize("(1)")).to.deep.equal(["(", "(", 1, 0]);
    expect(tokenize("(1)", 2)).to.deep.equal([")", ")", 3, 0]);
  });

  it("Should tokenize bracket and array operators.", () => {
    expect(tokenize("[1]")).to.deep.equal(["[", "[", 1, 0]);
    expect(tokenize("[1]", 2)).to.deep.equal(["]", "]", 3, 0]);
    expect(tokenize("[1, 2]", 2)).to.deep.equal([",", ",", 3, 0]);
  });

  it("Should tokenize braces and object operators.", () => {
    expect(tokenize("{a:1}")).to.deep.equal(["{", "{", 1, 0]);
    expect(tokenize("{b:1}", 4)).to.deep.equal(["}", "}", 5, 0]);
    expect(tokenize("{a:2, b:1}", 2)).to.deep.equal([":", ":", 3, 0]);
    expect(tokenize("{a:2, b:1}", 4)).to.deep.equal([",", ",", 5, 0]);
  });

  it("Should tokenize with correct index", () => {
    expect(tokenize("1 + ident * 1 ? a : b", 20)).to.deep.equal(["ident", "b", 21, 0]);
  });
});
