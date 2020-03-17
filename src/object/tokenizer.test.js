import { expect } from "chai";
import { tokenize } from "./tokenizer";

describe("tokenize()", () => {
  it("Should tokenize identifier.", () => {
    expect(tokenize("abc.")).to.deep.equal(["ident", "abc", 3]);
    expect(tokenize("d90jkjx+*")).to.deep.equal(["ident", "d90jkjx", 7]);
  });

  it("Should tokenize number.", () => {
    expect(tokenize("1")).to.deep.equal(["integer", "1", 1]);
    expect(tokenize("+100")).to.deep.equal(["integer", "+100", 4]);
    expect(tokenize("-100")).to.deep.equal(["integer", "-100", 4]);

    expect(tokenize(".1 +")).to.deep.equal(["float", ".1", 2]);
    expect(tokenize("+.1 +")).to.deep.equal(["float", "+.1", 3]);
    expect(tokenize("-0.1 +")).to.deep.equal(["float", "-0.1", 4]);
    expect(tokenize("0.1x")).to.deep.equal(["float", "0.1", 3]);

    expect(tokenize(".5% ni")).to.deep.equal(["percent", ".5%", 3]);
  });

  it.only("Should tokenize quoted string.", () => {
    expect(tokenize("'buang ka'")).to.deep.equal(["string", "\'buang ka\'", 10]);
    expect(tokenize("'buang\\' ka'")).to.deep.equal(["string", "\'buang\\' ka\'", 12]);
  });
});
