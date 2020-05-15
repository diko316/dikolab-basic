
import { tokenize } from "./tokenizer";

import PARSER_STATES from "./parse-states.json";
import PARSER_REFERENCE from "./parse-reference.json";

const ACTION_TOKENIZE = 1;
const ACTION_REDUCE = 2;
const ACTION_FOLLOW = 3;
const ACTION_END = 4;
const IGNORE_TOKENS = {};

function initialize() {
  const index = IGNORE_TOKENS;
  const list = PARSER_REFERENCE.ignoreTokens;
  let c = 0;
  let length = list.length;

  // ignore tokens
  for (; length--; c++) {
    index[list[c]] = true;
  }
}

initialize();

export function parse(subject) {
  const tokenizeAction = ACTION_TOKENIZE;
  const reduceAction = ACTION_REDUCE;
  const followAction = ACTION_FOLLOW;
  const endAction = ACTION_END;
  const manifest = PARSER_STATES;
  const ignoreTokens = IGNORE_TOKENS;

  const states = manifest.states;
  const ends = manifest.reduce;
  const root = manifest.root;
  const rpn = [];

  let stateAccess = manifest.initialState;
  let state = states[stateAccess];
  let end;
  let action = tokenizeAction;

  let parseStack = null;
  let inStack = null;
  let index = 0;
  let found;
  let token;
  let value;
  let from;
  let to;
  let production;
  let rule;
  let input;
  let length;
  let total;
  let rpnFrom;
  let rpnTo;
  let rpnIndex = 0;

  /* eslint no-labels:0 */
  mainLoop: for (; action !== endAction;) {
    switch (action) {
    case tokenizeAction:
      found = tokenize(subject, index);
      if (found) {
        token = found[0];
        from = index;
        to = found[2];
        index = to;

        // tokenize again
        if (token in ignoreTokens) {
          action = tokenizeAction;
          continue mainLoop;
        }

        // for RPN
        value = found[1];

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
      // console.log("follow! ", stateAccess, token, " -> ", state[token], ":", value);
      stateAccess = state[token];
      state = states[stateAccess];
      parseStack = [
        parseStack,
        inStack,
        rpnIndex
      ];

      // add to rpn
      rpn[rpnIndex++] = {
        lexeme: token,
        params: 0,
        from,
        to,
        value
      };

      // tokenize
      action = tokenizeAction;
      continue mainLoop;

    case reduceAction:
      // console.log("reducing ", stateAccess, ends[stateAccess]);
      end = ends[stateAccess];
      rule = end[0];
      length = total = end[1];
      production = end[2];
      rpnTo = null;

      for (; parseStack && length--;) {
        inStack = parseStack[1];
        input = inStack[1];
        if (input !== production[length]) {
          console.log("Reduce production mismatch! ", input);
          break mainLoop;
        }

        rpnFrom = rpn[parseStack[2]];

        if (!rpnTo) {
          rpnTo = rpn[parseStack[2]];
        }

        // resume, reduce did not end yet
        if (length !== 0) {
          parseStack = parseStack[0];
          continue;
        }

        // console.log(rpnFrom, rpnTo);

        // reduce successfull
        // add to rpn
        rpn[rpnIndex++] = {
          lexeme: rule,
          params: total,
          from: rpnFrom.from,
          to: rpnTo.to,
          value: null
        };

        stateAccess = inStack[0];
        state = states[stateAccess];

        // console.log("reduced! ", stateAccess, rule, ": ", production, " pending ", token, "=", value);

        // follow new state
        if (rule in state) {
          parseStack = [
            parseStack[0],
            [
              stateAccess,
              rule
            ],
            rpnIndex - 1
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

      // check if it should reduce back
      action = reduceAction;

      // or follow
      if (token && token in state) {
        action = followAction;
      }
      else if (!(stateAccess in ends)) {
        console.log("Unable to reduce! ", stateAccess, " token ", token, value, states[stateAccess]);
        break mainLoop;
      }

      continue mainLoop;
    }
  }

  // for (let item, c = 0, length = rpn.length; length--; c++) {
  //   item = rpn[c];
  //   console.log("[", item.lexeme, "|", item.params, item.value ? item.value : "", "]");
  // }
  // console.log("rpn: ", rpn);
  return rpn;
}
