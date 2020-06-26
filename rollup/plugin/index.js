import pluginNodeResolve from "./node-resolve";
import pluginCommonjs from "./commonjs";
// import pluginBabel from "./babel";
import pluginBuble from "./buble";
import pluginTerser from "./terser";
import pluginDelete from "./delete";
import pluginEslint from "./eslint";
import pluginJson from "./json";
import pluginMultiEntry from "./multi-entry";
import pluginCleanup from "./cleanup";
import pluginStrip from "./strip";


export default {
  "node-resolve": pluginNodeResolve,
  "commonjs": pluginCommonjs,
  // "babel": pluginBabel,
  "cleanup": pluginCleanup,
  "strip": pluginStrip,
  "json": pluginJson,
  "buble": pluginBuble,
  "terser": pluginTerser,
  "delete": pluginDelete,
  "eslint": pluginEslint,
  "multi-entry": pluginMultiEntry
};
