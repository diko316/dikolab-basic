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

function createFile(path, content) {
  const fullPath = PATH.resolve(process.cwd(), path);

  try {
    FS.writeFileSync(
      fullPath,
      content,
      {
        encoding: "utf8"
      }
    );
  }
  catch (error) {
    console.error("There were errors creating file: ", fullPath);
    console.error(error);
    return false;
  }

  return true;
}

function createJSONFile(path, jsonObject, optimized) {
  return createFile(
    path,
    JSON.stringify(jsonObject, null, optimized ? 0 : 2)
  );
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
  create: createFile,
  createJson: createJSONFile,
  getJson: getJSON,
  size: getFileSize
};
