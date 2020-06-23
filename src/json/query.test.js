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
  it.only("Should parse number, float, and percent.", () => {
    console.log(query("data[*].country[].name = \"diko\"; data[].country[]", subject));
    console.log(JSON.stringify(subject, null, 3));
  });
});