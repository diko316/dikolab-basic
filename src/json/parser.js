
import { tokenize } from "./tokenizer";

import PARSER_STATES from "./parse-states.json";

const ACTION_TOKENIZE = 1;
const ACTION_REDUCE = 2;
const ACTION_FOLLOW = 3;
const ACTION_END = 4;

export function parse(subject) {
  const tokenizeAction = ACTION_TOKENIZE;
  const reduceAction = ACTION_REDUCE;
  const followAction = ACTION_FOLLOW;
  const endAction = ACTION_END;
  const manifest = PARSER_STATES;
  const states = manifest.states;
  const ends = manifest.reduce;
  const root = manifest.root;

  let stateAccess = manifest.initialState;
  let state = states[stateAccess];
  let end;
  let action = tokenizeAction;

  let parseStack = null;
  let inStack = null;
  let index = 0;
  let token;
  let found;
  let to;
  let production;
  let rule;
  let input;
  let length;

  /* eslint no-labels:0 */
  mainLoop: for (; action !== endAction;) {
    switch (action) {
    case tokenizeAction:
      found = tokenize(subject, index);

      if (found) {
        token = found[0];
        to = found[2];
        index = to;

        // for RPN
        // value = found[1];
        // lines += found[3];

        // follow
        action = endAction;
        if (token in state) {
          action = followAction;
        }
        // try reducing
        else if (stateAccess in ends) {
          action = reduceAction;
        }
        // failed token
        else {
          console.log("Parse failed in token: ", token);
        }
      }
      // reduce to root
      else if (parseStack && stateAccess in ends) {
        action = reduceAction;
      }
      // parse failed!
      else {
        action = endAction;
        console.log("Parse failed! ");
      }
      continue mainLoop;

    case followAction:
      token = found[0];

      inStack = [
        stateAccess,
        token
      ];
      stateAccess = state[token];
      state = states[stateAccess];
      parseStack = [
        parseStack,
        inStack
      ];
      // tokenize
      action = tokenizeAction;
      continue mainLoop;

    case reduceAction:
      end = ends[stateAccess];
      rule = end[0];
      length = end[1];
      production = end[2];

      for (; parseStack && length--;) {
        inStack = parseStack[1];
        input = inStack[1];
        if (input !== production[length]) {
          console.log("Reduce production mismatch! ", input);
          break mainLoop;
        }

        // reduce successfull
        if (length === 0) {
          stateAccess = inStack[0];
          state = states[stateAccess];

          // follow new state
          if (rule in state) {
            parseStack = [
              parseStack[0],
              [
                stateAccess,
                rule
              ]
            ];
            stateAccess = state[rule];
            state = states[stateAccess];
          }
          // unable to follow reduced state
          else if (rule === root) {
            action = endAction;
            console.log("Parse Completed! ", rule);
            break mainLoop;
          }
          else {
            console.log("Reduced rule is invalid! ", rule, state);
            break mainLoop;
          }
        }
        else {
          parseStack = parseStack[0];
        }
      }

      // check if it should reduce back
      action = reduceAction;

      // or follow
      if (token && token in state) {
        action = followAction;
      }

      continue mainLoop;
    }
  }
}
