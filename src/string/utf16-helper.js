

export class U16StringIterator {
  constructor(subject) {
    this.value = subject;
    this.position = 0;
  }
  reset() {
    this.position = 0;
  }
  next() {
    const subject = this.value;
    const limit = subject.length;
    let position = this.position;
    let code = 0;
    let first = 0;
    let second = 0;
    
    if (position >= limit) {
      return null;
    }

    code = first = subject.charCodeAt(position++);
    if (first >= 0xD800 && first <= 0xDBFF && position < limit) {
      second = subject.charCodeAt(position++);

      if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
        // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        code = (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
      }
    }

    this.position = position;

    return [
      second ?
        String.fromCharCode(first, second) :
        String.fromCharCode(first),
      code
    ];
  }
}
