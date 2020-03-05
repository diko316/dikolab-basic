import pluginNodeResolve from "./node-resolve";
import pluginCommonjs from "./commonjs";
// import pluginBabel from "./babel";
import pluginBuble from "./buble";
import pluginTerser from "./terser";
import pluginDelete from "./delete";
import pluginEslint from "./eslint";
import pluginMultiEntry from "./multi-entry";
import pluginJsdoc from "./jsdoc";


export default {
  "node-resolve": pluginNodeResolve,
  "commonjs": pluginCommonjs,
  // "babel": pluginBabel,
  "buble": pluginBuble,
  "terser": pluginTerser,
  "delete": pluginDelete,
  "eslint": pluginEslint,
  "multi-entry": pluginMultiEntry,
  "jsdoc": pluginJsdoc
};
