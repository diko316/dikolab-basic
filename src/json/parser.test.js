import { expect } from "chai";
import { showErrors } from "./error-reporting";
import { parse } from "./parser";

function serializeRpn(rpn) {
  const content = [];
  let c;
  let length;
  let item;

  if (!rpn) {
    return null;
  }

  for (c = 0, length = rpn.length; length--; c++) {
    item = rpn[c];
    if (item.reduce === 0) {
      content[c] = item.lexeme;
      continue;
    }
    content[c] = (
      [
        item.lexeme,
        "|",
        item.reduce
      ]
    ).join("");
  }

  return content.join(" ");
}

function parseAndSerialize(subject) {
  return serializeRpn(parse(subject));
}

showErrors(true);

describe("parse()", () => {
  it("Should parse number, float, and percent.", () => {
    expect(parseAndSerialize("1")).to.not.equal(null);
    expect(parseAndSerialize("    +2")).to.not.equal(null);
    expect(parseAndSerialize("-2.00 ")).to.not.equal(null);
  });

  it("Should parse variables.", () => {
    expect(parseAndSerialize("@")).to.not.equal(null);
    expect(parseAndSerialize("@test")).to.not.equal(null);
  });

  it.only("Should parse variables.", () => {
    expect(parseAndSerialize("@")).to.not.equal(null);
    expect(parseAndSerialize("@test")).to.not.equal(null);
  });

  it.only("Should variables.", () => {
    console.log(parseAndSerialize("test.1"));
    console.log(parseAndSerialize(".1"));
    console.log(parseAndSerialize(".[1]"));
    console.log(parseAndSerialize(".[1..10]"));
    console.log(parseAndSerialize(".[1,10]"));
    console.log(parseAndSerialize(".[test]"));

    console.log(parseAndSerialize("1 * 1 / 2"));
    console.log(parseAndSerialize("1 - 1 / 2 + 3"));
    console.log(parseAndSerialize("\"test\" + 1 + 3"));

    console.log(parseAndSerialize("1 + \"test\" + 1"));
    console.log(parseAndSerialize("1 + \"test\""));


    console.log(parseAndSerialize("\"test\" + 10 > 1 + 2"));

    console.log(parseAndSerialize("b = .a = ? ? -1 + 'b': 2"));
  });
});
