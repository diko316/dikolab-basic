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

  // it.only("try", () => {
  //   const result = query(
  //     `
  //     me.data[] | filter ~ country[].value : /[a-z]+/
  //     `,
  //     {
  //       me: subject,
  //       filterparam: "filterparam",
  //       filter: function (pathvalue, values) {
  //         console.log("found json path value", pathvalue);
  //         console.log("   parameter: ", values);
  //       }
  //     }
  //   );
  //   console.log("result: ", result);
  // });
  it("Should silently return undefined syntax is erroneous", () => {
    expect(query("")).to.be.equal(undefined);
    expect(query("undefined + %")).to.be.equal(undefined);
    expect(query(". + undefined * ^", null)).to.be.equal(undefined);
  });

  it("Should silently return undefined if there are errors in code", () => {
    expect(query("ab", null)).to.be.equal(undefined);
  });

  it("Should silently allow erroneous function call but returns false if exception is thrown", () => {
    subject.erroneous = function () {
      return subject.nonExistentFunction(100);
    };
    expect(query("erroneous(10)", null)).to.be.equal(undefined);
  });

  it("Should be able to do math equations and return results.", () => {
    expect(query("10% * 100", subject)).to.be.equal(10);
    expect(query("1 + 2 * 3 / 4 - data[0].id", subject)).to.be.equal(1.5);
  });

  it("Should be able to run query on vars, numeric var, and (?) autofill vars.", () => {
    query(
      `
          .3.one = ?;
          @3.fortyFive = ?;
          .[3].diko = ?;
          .
        `,
      [
        1,
        45,
        "diko",
        subject
      ]
    );

    expect(subject.one).to.be.equal(1);
    expect(subject.fortyFive).to.be.equal(45);
    expect(subject.diko).to.be.equal("diko");
  });

  it("Should be able to do a function call and return value.", () => {
    function sampleFunction () {
      return "secret value"
    }

    subject.func = sampleFunction;
    expect(query("'my ' + func()", subject)).to.be.equal("my secret value");
  });

  it("Should be able to run custom filter using pipe | expression.", () => {
    function removeCountriesFilter (item, removedCountries) {
      // return false if country to remove is the current item
      return removedCountries.indexOf(item) === -1;
    }

    subject.filter = removeCountriesFilter;

    expect(query("data[].country[].value | filter: [\"US\", \"UK\"]", subject)).to.deep.equal(["PH", "HK", "CH"]);
  });


  it("Should be able to run custom filter using pipe | expression with changed context.", () => {
    let result = null;

    function filterOneItem(item, countries, match) {
      // return false if countries do not contain "match"
      return !!countries && countries.indexOf(match) !== -1;
    }

    result = query(
        "subject.data[] | filter: country[].value, @.filterParameter",
        {
          subject: subject,
          filterParameter: "CH",
          filter: filterOneItem
        }
      )
    expect(result.length).to.be.equal(1);
    expect(result[0].id).to.be.equal(2);
  });

  it("Should be able to run custom filter using pipe | expression with json sub query.", () => {
    let result = null;

    function matchCountry(country, match) {
      // return false if country do not contain "match"
      return country === match;
    }

    result = query(
      "subject.data[] | ~ country[].value match: @.filterParameter", {
        subject: subject,
        filterParameter: "CH",
        match: matchCountry
      }
    )
    expect(result.length).to.be.equal(1);
    expect(result[0].id).to.be.equal(2);
  });

  it("Should extract all data[].country[].value items from test data.", () => {
    expect(query("data[*].country[].value", subject)).to.deep.equal(["PH", "US", "UK", "HK", "CH"]);
  });

  it("Should add array item when setter query ends with [] expression.", () => {
    query(`
      data[].country[] = {
        value: "AL",
        "label": "Albania"
      }
    `, subject);

    expect(subject.data[0].country[3].value).to.be.equal("AL");
    expect(subject.data[1].country[2].value).to.be.equal("AL");
  });

  it("Should replace object properties that matches the query.", () => {
    query(`
      data[].country[].label = "replaced"
    `, subject);

    expect(subject.data[0].country[0].label).to.be.equal("replaced");
    expect(subject.data[0].country[1].label).to.be.equal("replaced");
    expect(subject.data[0].country[2].label).to.be.equal("replaced");
    expect(subject.data[1].country[0].label).to.be.equal("replaced");
    expect(subject.data[1].country[1].label).to.be.equal("replaced");
  });
});
