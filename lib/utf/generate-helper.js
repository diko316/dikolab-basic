const FILE = require("../file-helper");
const REPORTING = require("../error-reporting");

function generateWordCharClass() {
  const encode = String.fromCharCode;
  const words = {};
  let validword;
  let char;
  let c = 0;
  let length = 0xFFFF;
  let lowercase;
  let upppercase;
  let isUpperCase = false;

  for (; length--; c++) {
    char = encode(c);
    upppercase = char.toUpperCase();
    lowercase = upppercase.toLowerCase();
    isUpperCase = char === upppercase;
    validword = isUpperCase || char === lowercase;

    if (validword && lowercase !== upppercase) {
      words[c] = isUpperCase ? 1 : 2;
    }
  }

  return {
    words: words
  };
}

function generate() {
  const reportError = REPORTING.log;
  const args = process.argv.slice(2);
  const content = generateWordCharClass();
  let target = null;

  if (args.length < 1) {
    reportError(1, "Requires [target] parameter.");
  }

  target = args[0];

  if (!target) {
    reportError(1, "Requires [target] parameter.");
  }

  if (!FILE.createJson(target, content)) {
    reportError(2, `Failed creating [target] file. ${target}`);
  }

  console.error("Output size: ", (FILE.size(target) * 0.001).toFixed(2), " Kilobytes.");
  process.exit(0);
}

generate();
