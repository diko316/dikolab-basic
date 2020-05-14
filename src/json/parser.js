
import { tokenize } from "./tokenizer";

// import PARSER_STATES from "./parse-states.json";

export function parse(subject) {
  // const manifest = PARSER_STATES;
  // const states = manifest.states;
  // const root = manifest.root;

  // let state = states[manifest.initialState];
  let index = 0;
  let found;
  let to;
  let lines = 0;

  for (found = tokenize(subject, index); found; found = tokenize(subject, index)) {
    to = found[2];
    lines += found[3];
    index = to;

    console.log("found ", found);
  }

  console.log("lines: ", lines);
}
