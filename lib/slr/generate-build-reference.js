const REPORTING = require("../error-reporting");
const FILE = require("../file-helper");

function generate() {
  const reportError = REPORTING.log;
  const args = process.argv.slice(2);
  let content = null;
  let source = null;
  let target = null;

  if (args.length < 2) {
    reportError(1,
      args.length < 1
        ? "Requires [source] and [target] parameter."
        : "Requires [target] parameter."
    );
  }

  source = args[0];
  target = args[1];

  if (!source) {
    reportError(1, "Requires [source] parameter.");
  }

  if (!target) {
    reportError(1, "Requires [target] parameter.");
  }

  content = FILE.getJson(source);
  if (!content) {
    reportError(2, `Failed reading [source] file. ${source}`);
  }

  if (!FILE.createJson(target, content, true)) {
    reportError(2, `Failed creating [target] file. ${target}`);
  }

  console.error("Output size: ", (FILE.size(target) * 0.001).toFixed(2), " Kilobytes.");
  process.exit(0);
}

generate();
