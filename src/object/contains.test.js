import { expect } from "chai";

import { contains } from "./contains";

describe("contains(subject: any, property: string)", () => {
  it("should return true if an Object descendant class contains property.", () => {
    expect(
      contains(
        {
          name: "buang"
        },
        "name"
      )
    ).to.equal(true);
    expect(
      contains(
        {
          name: "buang"
        },
        "value"
      )
    ).to.equal(false);
  });

  it("should return true if an Native Object descendant class contains property.", () => {
    const regex = /test/;
    const date = new Date();
    const fn = function () {};

    regex.ni = "test";
    date.ni = "no";
    fn.ni = "buang";

    expect(contains(regex, "ni")).to.equal(true);
    expect(contains(date, "ni")).to.equal(true);
    expect(contains(fn, "ni")).to.equal(true);
  });

  it("should return false if an subject is not a valid Object or property is not convertible to string.", () => {
    const subject = {
      name: "test"
    };

    expect(contains(subject, null)).to.equal(false);
    expect(contains(subject, false)).to.equal(false);
    expect(contains(null, "yes")).to.equal(false);
  });
});
