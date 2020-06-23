import { expect } from "chai";
import { query } from "./query";

describe("query(subject, querycode)", () => {
  let subject = null;

  beforeEach(
    () => {
      subject = {
        name: "test",
        total: 0,
        data: [
          {
            status: true,
            id: 1,
            name: "diko",
            country: [
              {
                value: "PH",
                label: "Philippines"
              },
              {
                value: "US",
                label: "United States"
              },
              {
                value: "UK",
                label: "United Kingdom"
              }
            ]
          },
          {
            status: false,
            id: 2,
            name: "another",
            country: [
              {
                value: "HK",
                label: "Hong Kong"
              },
              {
                value: "CH",
                label: "Switzerland"
              }
            ]
          },
        ]
      };
    }
  );

  it("Should be able to do math equations and return results.", () => {
    expect(query("10% * 100", subject)).to.equal(10);
    expect(query("1 + 2 * 3 / 4 - data[0].id", subject)).to.equal(1.5);
  });

  it("Should be able to do a function call and return value.", () => {
    function sampleFunction () {
      return "secret value"
    }

    subject.func = sampleFunction;
    expect(query("'my ' + func()", subject)).to.equal("my secret value");
  });

  it("Should extract all data[].country[].value items from test data.", () => {
    expect(query("data[*].country[].value", subject)).to.deep.equal(["PH", "US", "UK", "HK", "CH"]);
  });
});