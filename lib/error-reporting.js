const PATH = require("path");

function reportError(exitCode, errorMessage) {
  const args = process.argv;
  const commandName = (
    [
      PATH.basename(args[0]),
      PATH.relative(process.cwd(), args[1])
    ]
  ).join(" ");

  if (errorMessage) {
    console.error("\n" + errorMessage + "\n");
  }

  console.error(
    ([
      "Usage:\n",
      commandName + " [grammar json file] [output json file]\n"
    ]).join("\n")
  );

  process.exit(exitCode);
}

module.exports = {
  log: reportError
};
