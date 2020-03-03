import { stringify } from "./type-cast";

import { U16StringIterator } from "./utf16-helper";

export class U16String {
  constructor(subject) {
    const value = stringify(subject);
    const iterator = new U16StringIterator(value);
    let length = 0;
    let definition = iterator.next();

    for (; definition; definition = iterator.next()) {
      console.log("definition:", definition, " length ", length);
    }

    // Object.defineProperty(
    //   this,
    //   "$definition",
    //   {
    //     value,
    //     writable: false
    //   }
    // );
  }
  another() {}
}
