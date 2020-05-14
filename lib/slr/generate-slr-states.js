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

function createJSONFile(path, jsonObject) {
  const fullPath = PATH.resolve(process.cwd(), path);

  try {
    FS.writeFileSync(
      fullPath,
      JSON.stringify(
        jsonObject,
        null,
        2
      ),
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

function findClosureTransition(stack, closureId) {
  let pointer = stack;
  let transition;

  for (; pointer; pointer = pointer[0]) {
    transition = pointer[1];
    if (transition[1] === closureId) {
      return transition;
    }
  }

  return null;
}

function getNextClosureId(reference, closureId) {
  let index;
  let length;
  let found = null;

  if (closureId in reference) {
    found = reference[closureId];
    index = found[2];
    length = found[3];
    if (index < length) {
      return createClosureId(
        reference,
        found[0],
        found[1],
        index + 1
      );
    }
  }

  return null;
}

function generateStates(manifest) {
  const root = manifest.root;
  const grammar = manifest.grammar;
  const states = {};
  const closureReference = {};
  const settings = {
    grammar: manifest.grammar,
    stateGen: 0,
    states: states
  };
  const initialState = createState(settings);
  const ends = {};
  const used = {};

  let batch;
  let nextBatch;
  let newBatch;
  let end;
  let stateAccess = initialState;
  let targetState;
  let state;
  let stateReference;
  let closureId;
  let closures = [];
  let closure;
  let reference;
  let rule;
  let index;
  let input;
  let transitionStack = null;
  let transition;
  let transitions;
  let tlength;
  let process;
  let c;
  let length;
  let list;
  let production;
  let pc;
  let plength;
  let steps = 0;
  let time = (new Date()).getTime();

  // create initial closures
  list = grammar[root];

  used[root] = true;

  for (c = 0, length = list.length; length--; c++) {
    steps++;
    closures[c] = closureId = createClosureId(
      closureReference,
      root,
      list[c],
      0
    );
    // console.log("start closure ", closureId, " in ", stateAccess);
  }

  batch = [
    null,
    [
      // from state
      stateAccess,
      // go to closures
      closures
    ]
  ];

  /* eslint no-labels: 0 */
  for (; batch;) {
    nextBatch = null;
    steps++;
    for (; batch; batch = batch[0]) {
      steps++;
      process = batch[1];
      stateAccess = process[0];
      closures = process[1];

      state = states[stateAccess];
      transitions = [];
      tlength = 0;

      stateReference = {};

      // populate closures and generate transitions
      for (c = 0, length = closures.length; length--; c++) {
        steps++;
        closure = closures[c];
        reference = closureReference[closure];
        rule = reference[0];
        production = reference[1];
        index = reference[2];
        plength = reference[3];

        // end
        if (index === plength) {
          // end state found
          if (!(stateAccess in ends)) {
            ends[stateAccess] = closure;
          }
          // report reduce-reduce conflice
          else if (ends[stateAccess] !== closure) {
            console.error("Found reduce-reduce conflict in ", stateAccess);
            console.error("   current: ", ends[stateAccess], " overwrite: ", rule);
            return null;
          }

          // next!
          continue;
        }

        // process input
        input = production[index];

        // non-terminal, add closure to process
        if (input in grammar) {
          list = grammar[input];
          for (pc = 0, plength = list.length; plength--; pc++) {
            steps++;
            production = list[pc];
            closureId = createClosureId(closureReference, input, production, 0);

            // add to closure if not yet added
            if (closures.indexOf(closureId) === -1) {
              closures[closures.length] = closureId;
              used[input] = true;
              length++;
            }
          }
        }

        // find transition in stack
        transition = findClosureTransition(
          transitionStack,
          closure
        );
        targetState = null;

        // create transition
        if (!transition) {
          if (input in state) {
            targetState = state[input];
          }
          else {
            targetState = createState(settings);
            state[input] = targetState;
          }
        }
        // reuse transition
        else if (!(input in state)) {
          targetState = transition[2];
          state[input] = targetState;
        }

        // register transitions
        if (targetState) {
          transition = [stateAccess, closure, targetState];
          transitions[tlength++] = transition;

          if (index === 0) {
            transitionStack = [
              transitionStack,
              transition
            ];
          }
        }
      }

      // postprocess transitions
      for (c = 0, length = transitions.length; length--; c++) {
        steps++;
        transition = transitions[c];
        targetState = transition[2];
        closureId = getNextClosureId(closureReference, transition[1]);

        // add closure for target state
        if (targetState in stateReference) {
          newBatch = stateReference[targetState];

          // add new closures
          closures = newBatch[1];
          closures[closures.length] = closureId;
        }
        // create batch
        else {
          newBatch = stateReference[targetState] = [
            // from state
            targetState,
            // go to closures
            [closureId]
          ];
          nextBatch = [
            nextBatch,
            newBatch
          ];
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
  reference = false;
  for (c = 0, length = list.length; length--; c++) {
    stateAccess = list[c];
    state = states[stateAccess];
    transitions = Object.keys(state);

    // detect shift/reduce conflict
    for (pc = 0, plength = transitions.length; plength--; pc++) {
      input = transitions[pc];
      if (input in grammar) {
        console.log(
          "Shift/Reduce conflict found: " + stateAccess + " -> " + input
        );
        reference = true;
      }
    }

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
  if (reference) {
    return null;
  }

  // create anchors from start closures
  return {
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
  const args = process.argv;
  let source = null;
  let target = null;
  let sourceObject = null;
  let content = null;

  if (args.length < 4) {
    reportError(1, "Invalid command parameters.");
  }

  source = args[2];
  target = args[3];

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

  if (!createJSONFile(target, content)) {
    reportError(5);
  }

  process.exit(0);
}

generate();
