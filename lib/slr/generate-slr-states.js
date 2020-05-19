const FS = require("fs");
const PATH = require("path");
const MARKER = "*";
const OPEN_SEPARATOR = "[";
const CLOSE_SEPARATOR = "]";
const SEPARATOR = "";
const EQUAL = "->";
const EMPTY = "";

function getManifestJSON(path) {
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

function createClosureId(reference, rule, production, index) {
  const total = production.length;
  const copy = production.slice(0);
  let c = 0;
  let length = total;
  let id = null;

  for (; length--; c++) {
    copy[c] = OPEN_SEPARATOR + copy[c] + CLOSE_SEPARATOR;
  }

  copy.splice(
    index > total ? total : index,
    0,
    MARKER
  );

  id = ([
    rule,
    EQUAL,
    copy.join(SEPARATOR)
  ]).join(EMPTY);

  // add to reference
  if (!(id in reference)) {
    reference[id] = [
      rule,
      production,
      index,
      total
    ];
  }
  return id;
}

function createState(settings) {
  const access = "s" + (++settings.stateGen);

  settings.states[access] = {};

  return access;
}

function generateClosures(settings, rule, closures) {
  const grammar = settings.grammar;
  const reference = settings.closures;
  const processed = {};
  const pending = [rule];

  let closureLength = closures.length;
  let productions;
  let c;
  let length;
  let production;
  let closureId;
  let input = rule;
  let pc = 0;
  let total = 1;
  let plength = 1;
  let item;
  let added = 0;

  if (input in grammar) {
    // add closures
    for (; plength--; pc++) {
      input = pending[pc];

      if (input in processed || !(input in grammar)) {
        continue;
      }
      processed[input] = true;

      productions = grammar[input];
      c = 0;
      length = productions.length;
      for (; length--; c++) {
        production = productions[c];
        closureId = createClosureId(reference, input, production, 0);

        if (closures.indexOf(closureId) === -1) {
          closures[closureLength++] = closureId;
          added++;
        }

        item = production[0];
        if (item in grammar) {
          pending[total++] = item;
          plength++;
        }
      }
    }
  }

  return added;
}

function generateStates(manifest) {
  const root = manifest.root;
  const grammar = manifest.grammar;
  const states = {};
  const closureReference = {};
  const settings = {
    grammar: manifest.grammar,
    stateGen: 0,
    states: states,
    closures: closureReference
  };
  const initialState = createState(settings);
  const used = {};
  const ends = {};
  const reuseTransition = {};
  const processedStates = {};

  let batch;
  let nextBatch;
  let batchIndex;
  let transitionBatch;
  let batchClosures;
  let end;
  let stateAccess = initialState;
  let targetState;
  let state;
  let closureId;
  let closures = [];
  let closure;
  let reference;
  let rule;
  let index;
  let input;
  let process;
  let c;
  let length;
  let list;
  let production;
  let plength;
  let failed = false;
  let steps = 0;
  let time = (new Date()).getTime();

  // create initial closures
  list = grammar[root];

  used[root] = true;

  generateClosures(settings, root, closures);

  batch = [
    null,
    [
      // from state
      stateAccess,
      // go to closures
      closures
    ]
  ];

  /* eslint no-labels:0 */
  mainLoop: for (; batch;) {
    nextBatch = null;
    for (; batch; batch = batch[0]) {
      process = batch[1];
      stateAccess = process[0];
      closures = process[1];
      steps++;

      if (stateAccess in processedStates) {
        continue;
      }
      else {
        processedStates[stateAccess] = true;
      }

      // finalize closures
      c = 0;
      length = closures.length;
      for (; length--; c++) {
        closure = closures[c];
        reference = closureReference[closure];
        rule = reference[0];
        production = reference[1];
        index = reference[2];
        plength = reference[3];

        steps++;

        if (index !== plength) {
          input = production[index];
          length += generateClosures(settings, input, closures);
        }
      }

      // create transitions
      c = 0;
      length = closures.length;
      batchIndex = {};
      state = states[stateAccess];
      for (; length--; c++) {
        closure = closures[c];
        reference = closureReference[closure];
        rule = reference[0];
        production = reference[1];
        index = reference[2];
        plength = reference[3];

        steps++;

        // create end states
        if (index === plength) {
          if (stateAccess in ends) {
            end = ends[stateAccess];
            if (end[0] !== rule || end[1] !== plength || end[2] !== production) {
              console.log(
                "Reduce-reduce conflict in ", stateAccess, ": ", closure
              );
              failed = true;
              break mainLoop;
            }
          }
          else {
            ends[stateAccess] = closure;
          }
        }
        else {
          input = production[index];

          if (!(input in used)) {
            used[input] = true;
          }

          closureId = createClosureId(
            closureReference,
            rule,
            production,
            index + 1
          );

          // reuse batchIndex
          if (input in batchIndex) {
            transitionBatch = batchIndex[input];
            targetState = transitionBatch[0];
            batchClosures = transitionBatch[1];
            batchClosures[batchClosures.length] = closureId;
          }
          // create new transition batch
          else {
            // finalize target state
            if (closure in reuseTransition) {
              targetState = reuseTransition[closure];
            }
            else {
              targetState = createState(settings);
              // save reuse transition
              if (index === 0) {
                reuseTransition[closure] = targetState;
              }
            }

            state[input] = targetState;

            batchIndex[input] = transitionBatch = [
              targetState,
              [closureId]
            ];

            // add new batch if not yet processed
            if (!(targetState in processedStates)) {
              nextBatch = [nextBatch, transitionBatch];
            }
          }
        }
      }
    }
    batch = nextBatch;
  }

  // set end time
  time = ((new Date()).getTime() - time);

  // report unused grammars
  list = Object.keys(grammar);
  for (c = 0, length = list.length; length--; c++) {
    rule = list[c];
    if (!(rule in used)) {
      console.error("Warning: " + rule + " production is not used.");
    }
  }

  console.error("Generated " + settings.stateGen + " states in " + steps + " steps and " + (time / 1000) + " seconds.");

  // post process end state
  list = Object.keys(ends);
  for (c = 0, length = list.length; length--; c++) {
    stateAccess = list[c];
    state = states[stateAccess];

    // replace end
    closureId = ends[stateAccess];
    closure = closureReference[closureId];
    ends[stateAccess] = [
      closure[0],
      closure[2],
      closure[1]
    ];
  }

  // fail if Shift/Reduce conflict found
  if (failed) {
    return null;
  }

  // create anchors from start closures
  return {
    optimized: true,
    symbols: {},
    root: root,
    initialState: initialState,
    states: states,
    reduce: ends
  };
}

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

function generate() {
  const args = process.argv.slice(2);
  let optimized = false;
  let source = null;
  let target = null;
  let sourceObject = null;
  let content = null;
  let param;
  let c = 0;
  let length = args.length;

  if (length < 2) {
    reportError(1, "Invalid command parameters.");
  }

  for (; length--; c++) {
    param = args[c];
    switch (param) {
    case "-o":
    case "--optimized":
      optimized = true;
      break;

    default:
      if (!source) {
        source = param;
      }
      else if (!target) {
        target = param;
      }
    }
  }

  if (!source) {
    reportError(2, "Source JSON file parameter is empty ");
  }

  if (!target) {
    reportError(2, "Target JSON file parameter is empty ");
  }

  sourceObject = getManifestJSON(source);
  if (!sourceObject) {
    reportError(3);
  }

  content = generateStates(sourceObject);

  if (!content) {
    reportError(4, "Failed Generating SLR states from file " + source);
  }

  if (!createJSONFile(target, content, optimized)) {
    reportError(5);
  }

  process.exit(0);
}

generate();
