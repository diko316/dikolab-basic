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
    expect(parseAndSerialize("1")).to.equal("integer Number|1 Numeric|1 Factor|1 Term|1 Scalar|1 Comp|1 Logical|1 Cond|1 Stmt|1 $ JsonQuery|2");
    expect(parseAndSerialize("    +2")).to.equal("+ integer Number|1 Signed|2 Numeric|1 Factor|1 Term|1 Scalar|1 Comp|1 Logical|1 Cond|1 Stmt|1 $ JsonQuery|2");
    expect(parseAndSerialize("-2.00 ")).to.equal("- float Number|1 Signed|2 Numeric|1 Factor|1 Term|1 Scalar|1 Comp|1 Logical|1 Cond|1 Stmt|1 $ JsonQuery|2");
  });

  it("Should variables.", () => {
    expect(parseAndSerialize("@")).to.equal("@ Root|1 Variable|1 JsonPath|1 Variant|1 Factor|1 Term|1 Scalar|1 Comp|1 Logical|1 Cond|1 Stmt|1 $ JsonQuery|2");
    expect(parseAndSerialize("@test")).to.equal("@ ident VarRef|2 Variable|1 JsonPath|1 Variant|1 Factor|1 Term|1 Scalar|1 Comp|1 Logical|1 Cond|1 Stmt|1 $ JsonQuery|2");
  });

  it.only("Should variables.", () => {
    console.log(parseAndSerialize("@test"));
  });
});
