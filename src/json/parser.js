
import { tokenize } from "./tokenizer";

import { reportParseError } from "./error-reporting";

import * as PARSER_STATES from "./parse-states.json";
import * as PARSER_REFERENCE from "./parse-reference.json";

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

/**
 * RPN (Reverse Polish Notation) struct.
 *
 * @protected
 * @typedef {object} RpnItem
 * @property {string} ruleId - Terminal token name or production name if non-terminal.
 * @property {string|null} value - The raw token from tokenize process. null for reduced non-terminal.
 * @property {number} reduce - The total number of rpn to merge. zero if terminal or token.
 * @property {number} from - The start character index of code parsed.
 * @property {number} to - The end character index of code parsed.
 * @property {number} lineFrom - The start line number of code parsed.
 * @property {number} lineTo - The end line number of code parsed.
 */

/**
 * List of RPN (Reverse Polish Notation) items.
 *
 * @protected
 * @typedef {RpnItem[]} Rpn
 */

/**
 * Parse JSON Query code and returns list of reverse polish notation (RPN) list.
 *
 * @protected
 * @param {string} subject - The code to parse.
 * @returns {Rpn|null} - RPN list as abstract tree. Returns null if parse failed.
 */
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
  let erroneous = false;
  let lineBefore = 1;
  let lines = 1;
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
        lineBefore = lines;
        lines += found[3];

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
          erroneous = true;
          reportParseError(
            "Syntax error",
            subject,
            from,
            to,
            lineBefore,
            lines
          );
          break mainLoop;
        }
      }
      // reduce to root
      else if (parseStack && stateAccess in ends) {
        action = reduceAction;
      }
      // parse failed!
      else {
        erroneous = true;
        reportParseError(
          "Syntax error",
          subject,
          from,
          to,
          lineBefore,
          lines
        );
        break mainLoop;
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
        ruleId: token,
        reduce: 0,
        from,
        to,
        lineFrom: lineBefore,
        lineTo: lines,
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
        rpnFrom = rpn[parseStack[2]];

        if (!rpnTo) {
          rpnTo = rpn[parseStack[2]];
        }

        if (input !== production[length]) {
          erroneous = true;
          reportParseError(
            `Syntax error of ${input}`,
            subject,
            rpnFrom.from,
            rpnTo.to,
            rpnFrom.lineFrom,
            rpnTo.lineTo
          );
          break mainLoop;
        }

        // resume, reduce did not end yet
        if (length !== 0) {
          parseStack = parseStack[0];
          continue;
        }

        // reduce successfull
        // add to rpn
        rpn[rpnIndex++] = {
          ruleId: end[3],
          reduce: total,
          from: rpnFrom.from,
          to: rpnTo.to,
          lineFrom: rpnFrom.lineFrom,
          lineTo: rpnTo.lineTo,
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
        // parse complete!
        else if (rule === root) {
          break mainLoop;
        }
        // unable to follow reduced state
        else {
          erroneous = true;
          reportParseError(
            `Syntax error in sequence ${rule}`,
            subject,
            rpnFrom.from,
            rpnTo.to,
            rpnFrom.lineFrom,
            rpnTo.lineTo
          );
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
        erroneous = true;
        if (token) {
          reportParseError(
            `Syntax error misplaced token: ${token}`,
            subject,
            from,
            to,
            lineBefore,
            lines
          );
        }
        else {
          reportParseError(
            "Syntax error",
            subject,
            from,
            to,
            lines,
            lines
          );
        }
        break mainLoop;
      }

      continue mainLoop;
    }
  }

  // console.log("partial ", JSON.stringify(rpn, null, 3));
  if (erroneous && rpn.length) {
    console.log(
      "last partial rpn: ",
      JSON.stringify(
        rpn.slice(
          Math.max(rpn.length - 5, 0),
          rpn.length
        ),
        null,
        3
      )
    );
  }

  return erroneous ? null : rpn;
}
