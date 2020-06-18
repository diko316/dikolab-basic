import { expect } from "chai";
import { access } from "./path";

describe("JSON query helper access(subject, accesPath, fill, value)", () => {
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

  it("Should extract country.label using expression: data[1].country[1].label", () => {
    // data[].id
    const value = access(
      subject,
      [
        [1, false, "data"],
        [1, true, 1],
        [1, false, "country"],
        [1, true, 1],
        [1, false, "label"]
      ]
    );

    expect(value).to.equal("Switzerland");
  });

  it("Should extract ids using expression: data[].id", () => {
    // data[].id
    const value = access(
      subject,
      [
        [1, false, "data"],
        [3, true, null],
        [1, false, "id"]
      ]
    );

    expect(value).to.deep.equal([1, 2]);
  });

  it("Should extract country values using expression: data[].country[].value", () => {
    // data[].id
    const value = access(
      subject,
      [
        [1, false, "data"],
        [3, true, null],
        [1, false, "country"],
        [3, true, null],
        [1, false, "value"]
      ]
    );

    expect(value).to.deep.equal(["PH", "US", "UK", "HK", "CH"]);
  });

  it("Should extract countries values using expression: data[].country[0,1,2].value", () => {
    // data[].id
    const value = access(
      subject,
      [
        [1, false, "data"],
        [3, true, null],
        [1, false, "country"],
        [2, true, [0, 1, 2]],
        [1, false, "value"]
      ]
    );

    expect(value).to.deep.equal(["PH", "US", "UK", "HK", "CH"]);
  });

  it("Should extract countries values using expression: data[].country[[0..2]].value", () => {
    // data[].id
    const value = access(
      subject,
      [
        [1, false, "data"],
        [3, true, null],
        [1, false, "country"],
        [2, true, [[0, 2]]],
        [1, false, "value"]
      ]
    );

    expect(value).to.deep.equal(["PH", "US", "UK", "HK", "CH"]);
  });

  it("Should update countries values using expression: data[*].country[] = {value, label}", () => {
    access(
      subject,
      [
        [1, false, "data"],
        [3, true, true],
        [1, false, "country"],
        [3, true, false]
      ],
      true,
      {
        value: "AL",
        label: "Albania"
      }
    );
    expect(subject.data[0].country[3].value).to.equal("AL");
    expect(subject.data[1].country[2].value).to.equal("AL");
  });

  it("Should update countries values using expression: data[*].name = \"same\"", () => {
    access(
      subject,
      [
        [1, false, "data"],
        [3, true, true],
        [1, false, "name"]
      ],
      true,
      "same"
    );
    expect(subject.data[0].name).to.equal("same");
    expect(subject.data[1].name).to.equal("same");
  });

  it("Should de;ete name using expression: unset data[*].name", () => {
    access(
      subject,
      [
        [1, false, "data"],
        [3, true, true],
        [1, false, "name"]
      ],
      null
    );

    expect(subject.data[0]).to.not.have.property("name");
    expect(subject.data[1]).to.not.have.property("name");
  });

  it.only("Should delete data[1] using expression: unset data[1]", () => {
    access(
      subject,
      [
        [1, false, "data"],
        [1, true, 1]
      ],
      null
    );

    expect(subject.data.length).to.equal(1);
  });
});
