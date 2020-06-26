const FILE = require("../file-helper");
const REPORTING = require("../error-reporting");
const MARKER = "*";
const OPEN_SEPARATOR = "[";
const CLOSE_SEPARATOR = "]";
const SEPARATOR = "";
const EQUAL = "->";
const EMPTY = "";

const TO_STRING = Object.prototype.toString;

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

function createProductionId(settings, closureId) {
  const markup = [];
  const grammar = settings.grammar;
  const reference = settings.closures;
  let found = null;
  let markupLength = 0;
  let production = null;
  let c;
  let length;
  let input;

  if (closureId in reference) {
    found = reference[closureId];
    production = found[1];

    for (c = 0, length = production.length; length--; c++) {
      input = production[c];

      // terminals syntax <token>
      markup[markupLength++] = input in grammar ? input : `<${input}>`;
    }

    return `${found[0]}->${markup.join(" ")}`;
  }

  return null;
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
              console.error(
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
      closure[1],
      createProductionId(settings, closureId)
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

function getAndMergeManifest() {
  const toString = TO_STRING;
  const reportError = REPORTING.log;
  const args = process.argv.slice(2);
  const sources = [];
  const sourceFiles = [];

  let optimized = false;
  let config = null;

  let length = args.length;
  let source = null;
  let target = null;
  let sourcesLength = 0;
  let sourceFileLength = 0;

  let content = null;
  let registeredGrammar = null;
  let c = 0;

  let param;
  let grammar;
  let root;
  let keys;
  let rule;
  let production;
  let glength;
  let gc;
  let item;

  /* eslint no-labels: 0 */
  mainLoop: for (; length--; c++) {
    param = args[c];

    if (!param) {
      continue;
    }

    switch (param) {
    // set optimized
    case "-o":
    case "--optimized":
      optimized = true;
      continue mainLoop;

    case "-c":
    case "--config":
      if (!length) {
        REPORTING.log(2, "--config switch requires Config file parameter.");
      }
      length--;
      param = args[++c];
      config = FILE.getJson(param);
      if (!config) {
        reportError(2, "Config file not found. " + param);
      }
      else if (toString.call(config) !== "[object Object]") {
        reportError(2, "Config file is Malformed. " + param);
      }

      // add sources to args for further processing
      item = config.sources;
      if (item && toString.call(item) === "[object Array]") {
        length += item.length;
        args.splice.apply(
          args,
          [c + 1, 0].concat(item)
        );
      }

      // set target
      item = config.target;
      if (item && typeof item === "string") {
        target = item;
      }

      // optimized?
      item = config.optimized;
      if (item && typeof item === "boolean") {
        optimized = item;
      }
      continue mainLoop;
    }

    sources[sourcesLength++] = param;
  }

  if (!sourcesLength) {
    reportError(2, "Requires Source JSON file parameter/s.");
  }

  if (!target) {
    if (sourcesLength < 2) {
      reportError(2, "Requires Target JSON file parameter.");
    }

    target = sources[--sourcesLength];
  }

  // merge
  length = sourcesLength;
  c = 0;

  for (; length--; c++) {
    param = sources[c];

    // register source
    content = FILE.getJson(param);
    if (!content) {
      reportError(3);
    }

    sourceFiles[sourceFileLength++] = param;

    // merge
    if (!source) {
      source = {};
    }

    // merge root
    root = content.root;
    if (root && typeof root === "string") {
      source.root = root;
    }

    // merge grammars
    grammar = content.grammar;
    if (grammar) {
      keys = Object.keys(grammar);
      glength = keys.length;
      gc = 0;

      for (; glength--; gc++) {
        rule = keys[gc];
        production = grammar[rule];

        if (rule && production) {
          if (!registeredGrammar) {
            source.grammar = registeredGrammar = {};
          }

          registeredGrammar[rule] = production;
        }
      }
    }
  }

  if (!source) {
    reportError(2, "There are no Grammar manifest in source JSON file/s.");
  }

  if (!source.root) {
    reportError(2, "There are no \"root\" augmented Grammar defined in source JSON file/s.");
  }

  if (!registeredGrammar) {
    reportError(2, "There are no \"production rules\" defined in Grammar source JSON file/s.");
  }

  return {
    sourceFiles: sourceFiles,
    source: source,
    target: target,
    optimized: optimized
  };
}

function generate() {
  const reportError = REPORTING.log;
  const options = getAndMergeManifest();
  let content = null;
  let target = null;

  if (!options) {
    reportError(1, "Invalid command parameters.");
  }

  content = generateStates(options.source);
  target = options.target;

  if (!content) {
    reportError(4, "Failed to Generate SLR states from manifest files:\n * " + options.sourceFiles.join("\n * "));
  }

  if (!FILE.createJson(target, content, options.optimized)) {
    reportError(5);
  }

  console.error("Output size: ", (FILE.size(target) * 0.001).toFixed(2), " Kilobytes.");

  process.exit(0);
}

generate();
