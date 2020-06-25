import { expect } from "chai";
import { build } from "./build";

const F = Function;
let show = false;

function tryBuild(code) {
  const result = build(code);
  let func = null;

  if (result) {
    try {
      func = new F(result[0], result[1]);
      if (show) {
        console.log(
          "function query(", result[0], "){\n",
          result[1],
          "\n}\n"
        );
      }
    }
    catch (error) {
      console.error("Error evaluating code");
      console.error(result[0]);
      console.error(result[1]);
      console.error(error);
      return null;
    }
  }
  
  return result;
}

describe("build()", () => {
  // it.only("try", () => {
  //   show = true;
  //   // tryBuild("name");
  //   // tryBuild("1 | buang");
  //   tryBuild("data[] | filter: country[].value");
  // });

  it("Should build native query!.", () => {
    expect(tryBuild("-1")).to.not.equal(null);
    expect(tryBuild("10%")).to.not.equal(null);
    expect(tryBuild("\"diko\"")).to.not.equal(null);
    expect(tryBuild("'diko'")).to.not.equal(null);
    expect(tryBuild("null")).to.not.equal(null);
    expect(tryBuild("true")).to.not.equal(null);
    expect(tryBuild("false")).to.not.equal(null);
    expect(tryBuild("{ id: 1, name: 'diko'}")).to.not.equal(null);
    expect(tryBuild("[1, 'test', true]")).to.not.equal(null);
  });

  it("Should build data variants query!.", () => {
    expect(tryBuild(".")).to.not.equal(null);
    expect(tryBuild("?")).to.not.equal(null);
    expect(tryBuild("@")).to.not.equal(null);
    expect(tryBuild("@named")).to.not.equal(null);
    expect(tryBuild("@1")).to.not.equal(null);
  });

  it("Should build path query!.", () => {
    expect(tryBuild("property")).to.not.equal(null);

    expect(tryBuild(".name")).to.not.equal(null);
    expect(tryBuild(".*")).to.not.equal(null);
    expect(tryBuild(".[*]")).to.not.equal(null);
    expect(tryBuild(".[]")).to.not.equal(null);
    expect(tryBuild(".[].test")).to.not.equal(null);
    expect(tryBuild(".[1..10, 15].test")).to.not.equal(null);

    expect(tryBuild("?.name")).to.not.equal(null);
    expect(tryBuild("?.*")).to.not.equal(null);
    expect(tryBuild("?[*]")).to.not.equal(null);
    expect(tryBuild("?[]")).to.not.equal(null);
    expect(tryBuild("?[].test")).to.not.equal(null);
    expect(tryBuild("?[1..10, 15].test")).to.not.equal(null);

    expect(tryBuild("@.name")).to.not.equal(null);
    expect(tryBuild("@.*")).to.not.equal(null);
    expect(tryBuild("@[*]")).to.not.equal(null);
    expect(tryBuild("@[]")).to.not.equal(null);
    expect(tryBuild("@[].test")).to.not.equal(null);
    expect(tryBuild("@[1..10, 15].test")).to.not.equal(null);

    expect(tryBuild("@1.name")).to.not.equal(null);
    expect(tryBuild("@1.*")).to.not.equal(null);
    expect(tryBuild("@1[*]")).to.not.equal(null);
    expect(tryBuild("@1[]")).to.not.equal(null);
    expect(tryBuild("@1[].test")).to.not.equal(null);
    expect(tryBuild("@1[1..10, 15].test")).to.not.equal(null);

    expect(tryBuild("@data.name")).to.not.equal(null);
    expect(tryBuild("@data.*")).to.not.equal(null);
    expect(tryBuild("@data[*]")).to.not.equal(null);
    expect(tryBuild("@data[]")).to.not.equal(null);
    expect(tryBuild("@data[].test")).to.not.equal(null);
    expect(tryBuild("@data[1..10, 15].test")).to.not.equal(null);

    expect(tryBuild("@data.name")).to.not.equal(null);
    expect(tryBuild("@data.*")).to.not.equal(null);
    expect(tryBuild("@data[*]")).to.not.equal(null);
    expect(tryBuild("@data[]")).to.not.equal(null);
    expect(tryBuild("@data[].test")).to.not.equal(null);
    expect(tryBuild("@data[\"first\", 1..10, 15].test")).to.not.equal(null);
  });

  it("Should build assignment query!.", () => {
    expect(tryBuild("data = 1")).to.not.equal(null);
    expect(tryBuild("data[].state = ?")).to.not.equal(null);
  });

  it("Should build unset query!.", () => {
    expect(tryBuild("delete data")).to.not.equal(null);
    expect(tryBuild("delete data[].state")).to.not.equal(null);
  });

  it("Should build multiple unset query!.", () => {
    expect(tryBuild("delete data")).to.not.equal(null);
    expect(tryBuild("delete data[].state, name, ?[].id")).to.not.equal(null);
  });

  it("Should build var declarations query!.", () => {
    expect(tryBuild("object from ?; delete @object.name")).to.not.equal(null);
    expect(tryBuild("object from @; data[].state")).to.not.equal(null);
  });

  it("Should build function calls query!.", () => {
    expect(tryBuild("func(?, property.name, 1)")).to.not.equal(null);
    expect(tryBuild("call()")).to.not.equal(null);
  });

  it("Should build arithmetic query!.", () => {
    expect(tryBuild("1 + 2 * 3")).to.not.equal(null);
    expect(tryBuild("1 * ? / 100")).to.not.equal(null);
    expect(tryBuild("1 / 0")).to.not.equal(null);
    expect(tryBuild("'diko' + 2 * 3")).to.not.equal(null);
  });

  it("Should build comparison query!.", () => {
    expect(tryBuild("1 <= 3")).to.not.equal(null);
    expect(tryBuild("1 < ?")).to.not.equal(null);
    expect(tryBuild("@ >= ?")).to.not.equal(null);
    expect(tryBuild("@0 > .")).to.not.equal(null);
    expect(tryBuild("@diko =~ \"diko\"")).to.not.equal(null);
    expect(tryBuild("@diko =~ /^diko/")).to.not.equal(null);

    expect(tryBuild("@diko === .")).to.not.equal(null);
    expect(tryBuild("@diko !== 1")).to.not.equal(null);
    expect(tryBuild("? != 1")).to.not.equal(null);
    expect(tryBuild("? == 2")).to.not.equal(null);
  });

  it("Should build logical query!.", () => {
    expect(tryBuild("1 && 3")).to.not.equal(null);
    expect(tryBuild("1 || ?")).to.not.equal(null);
    expect(tryBuild("@ >= 1 && 1")).to.not.equal(null);
  });

  it("Should build logical query!.", () => {
    expect(tryBuild("1 && @ >= 1")).to.not.equal(null);
    expect(tryBuild("1 < ? && @ >= 1")).to.not.equal(null);
    expect(tryBuild("1 < ? && @ >= 1 || null")).to.not.equal(null);
  });

  it("Should build ternary condition query!.", () => {
    expect(tryBuild("1 && @ >= 1 ? ? : null")).to.not.equal(null);
    expect(tryBuild("1 < ? && @ >= 1 ? @ : .")).to.not.equal(null);
    expect(tryBuild("1 < ? && @ >= 1 || null ? 1 : 0")).to.not.equal(null);
  });

  it("Should build filtered query!.", () => {
    expect(tryBuild("1 | buang")).to.not.equal(null);
    expect(tryBuild(". | buang | test")).to.not.equal(null);
    expect(tryBuild("(.) | filter: 1, 3")).to.not.equal(null);
    expect(tryBuild("data[] | select: 3, true, null")).to.not.equal(null);
  });
});
