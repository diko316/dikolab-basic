import { Utf16 } from "./utf16";

describe("utf16", () => {
  it.only("Should create Utf16 string", () => {
    const sample = '\uD83D\uDCA9';
    const instance = new Utf16(`buang${sample}`);

    console.log(
      instance,
      instance.length
    );
  });
});
