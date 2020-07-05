import { expect } from "chai";

import { assign } from "./assign";

describe("assign(subject: any)", () => {
  let subject;
  beforeEach(() => {
    subject = {
      name: "what"
    };
  });

  it("should return subject parameter populated with properties from source parameter.", () => {
    expect(
      assign(
        subject,
        {
          name: "buang"
        }
      )
    ).to.equal(subject);

    expect(subject.name).to.equal("buang");
  });

  it("should return subject parameter if parameter is invalid type.", () => {
    expect(
      assign(
        null,
        {
          name: "buang"
        }
      )
    ).to.equal(null);

    expect(
      assign(
        subject,
        null
      )
    ).to.equal(subject);

    subject = [];
    expect(
      assign(
        subject,
        null
      )
    ).to.equal(subject);
  });
});
