const FS = require("fs");
const PATH = require("path");

function getJSON(path) {
  const fullPath = PATH.resolve(process.cwd(), path);
  let contents = null;

  try {
    contents = FS.readFileSync(
      fullPath,
      {
        encoding: "utf8"
      }
    );
  }
  catch (error) {
    console.error("Failed reading file: " + fullPath);
    console.error(error);
    return false;
  }

  try {
    return JSON.parse(contents);
  }
  catch (error) {
    console.error("JSON content is Malformed in file: " + fullPath);
    console.error(error);
    return false;
  }
}

function createJSONFile(path, jsonObject, optimized) {
  const fullPath = PATH.resolve(process.cwd(), path);

  try {
    FS.writeFileSync(
      fullPath,
      JSON.stringify(jsonObject, null, optimized ? 0 : 2),
      {
        encoding: "utf8"
      }
    );
  }
  catch (error) {
    console.error("There were errors creating JSON file: ", fullPath);
    console.error(error);
    return false;
  }

  return true;
}

function getFileSize(path) {
  const fullPath = PATH.resolve(process.cwd(), path);
  let stat = null;

  try {
    stat = FS.statSync(fullPath);
    return stat.size || 0;
  }
  catch (error) {
    console.error("There were errors getting files size of: ", fullPath);
    console.error(error);
    return 0;
  }
}

module.exports = {
  create: createJSONFile,
  get: getJSON,
  size: getFileSize
};
