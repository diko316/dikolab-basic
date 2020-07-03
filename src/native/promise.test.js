import { expect } from "chai";

import { promise } from "./promise";

describe("promise()", () => {
  it("should return true if parameter is a native Promise instance.", () => {
    expect(
      promise(
        Promise.resolve(true)
      )
    ).to.equal(true);
    expect(
      promise(
        new Promise(
          function (resolve) {
            resolve(1)
          }
        )
      )
    ).to.equal(true);
  });

  it("should return true if parameter is an Object that's A+ thenable.", () => {
    expect(promise(
        {
          then: function () {
            
          }
        }
      )
    ).to.equal(true);
  });

  it("should return false if parameter is not a thenable object.", () => {
    expect(promise({})).to.equal(false);
    expect(promise(1)).to.equal(false);
    expect(promise(/then/)).to.equal(false);
    expect(promise("then")).to.equal(false);
  });
});
