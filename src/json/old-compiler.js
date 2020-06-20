import { parse } from "./parser";

import {
  EMPTY_FUNCTION,
  TYPE_STRING,
  TYPE_NUMBER
} from "../native/constants";

import { quoteEscapify } from "../string/format";

import COMPILER_REFERENCE from "./compiler-reference.json";

const TEMPLATES = COMPILER_REFERENCE.template;
const COMPILE_ACCEPT_RPN = 1;
const COMPILE_CREATE_CODEREF = 2;
const COMPILE_INSERT_CODEREF = 3;
const COMPILE_PROCESS_CODEREF = 4;

const SYMBOL_PREFIX = "v";
const REF_PREFIX = "r";
const CAST_REFERENCE = COMPILER_REFERENCE.typecast;
const CAST_PARAMS = [
  {
    source: 0
  }
];

function createCode(settings, template, args) {
  let symbol = "";
  let code = "";
  let codes;
  let codeLength;
  let process;
  let c;
  let length;
  let value;

  // generate code
  process = template.body;
  if (process) {
    codes = [];
    codeLength = 0;
    c = 0;
    length = process.length;
    for (; length--; c++) {
      value = process[c];
      value = value in args ? args[value] : value;
      if (value) {
        codes[codeLength++] = value;
      }
    }
    if (codeLength) {
      code = codes.join("") + "\n";
    }
  }

  // generate return reference
  process = template.return;
  if (process) {
    codes = [];
    codeLength = 0;
    c = 0;
    length = process.length;
    for (; length--; c++) {
      value = process[c];
      value = value in args ? args[value] : value;
      if (value) {
        codes[codeLength++] = value;
      }
    }
    if (codeLength) {
      symbol = codes.join("");
    }
  }

  return [symbol, code];
}

function createCodeParams(settings, symbolCount, params, nodes) {
  const symbolPrefix = SYMBOL_PREFIX;
  const refPrefix = REF_PREFIX;
  const templates = TEMPLATES;
  const castReference = CAST_REFERENCE;
  const typeNumber = TYPE_NUMBER;
  const castParams = CAST_PARAMS;
  const symbols = settings.symbols;
  const vars = settings.reference;
  const args = {};

  let symbolLength = symbols.length;
  let key;
  let argsLength = 0;
  let codeLength = 0;
  let c;
  let length;
  let param;
  let symbol;
  let node;
  let code;
  let cast;
  let type;
  let codes;
  let reference;
  let source;
  let paramType;
  let codeKey;
  let ref;
  let resolve;

  // generate symbols
  if (symbolCount) {
    length = symbolCount;
    for (; length--;) {
      symbol = `${symbolPrefix}${symbolLength + 1}`;
      symbols[symbolLength++] = symbol;
      key = argsLength++;
      args[`$${key}`] = "";
      args[key] = symbol;
    }
  }

  // generate parameters
  c = 0;
  length = params.length;
  for (; length--; c++) {
    param = source = params[c];
    paramType = cast = null;
    if (typeof param !== typeNumber) {
      source = param.source;
      paramType = param.as;
      cast = param.cast;
      resolve = param.resolve;
    }
    key = argsLength++;
    codeKey = `$${key}`;

    // find parameter source
    if ((source === 0 || source) && source in nodes) {
      node = nodes[source];
    }
    // undefined fill in
    else {
      args[codeKey] = "";
      args[key] = "undefined /* child not found */";
      continue;
    }

    type = node.type;

    // finalize reference to use
    ref = node.ref;

    switch (paramType) {
    case "autofill":
      ref = ++settings.vars;

    // falls through
    case "id":
      ref = String(ref) || "undefined";
      symbol = quoteEscapify(ref);
      ref = ref in vars
        ? vars[ref]
        : (vars[ref] = `"${symbol}"`);
      break;
    }

    // create initial code
    codeLength = 0;
    codes = [];
    code = node.code;
    if (code) {
      codes[codeLength++] = code;
    }

    // resolve or typecast
    if (resolve || cast) {
      // typecast if needed
      reference = cast && cast !== type &&
        cast in castReference &&
        castReference[cast];
    }

    // typecast if needed
    reference = cast && cast !== type &&
      cast in castReference &&
      castReference[cast];

    if (reference) {
      // finalize type if type not found
      if (!(type in reference)) {
        // use wildcard
        type = "*";
      }

      // type cast if found
      if (type in reference) {
        cast = createCode(
          settings,
          templates[
            reference[type]
          ],
          createCodeParams(
            settings,
            0,
            castParams,
            [node]
          )
        );

        // replace!
        symbol = cast[0];
        if (symbol) {
          ref = symbol;
        }

        // add code
        code = cast[1];
        if (code) {
          codes[codeLength++] = code;
        }
      }
    }

    args[codeKey] = codeLength ? codes.join("") : "";
    args[key] = ref;
  }

  return args;
}

export function compile(subject, params) {
  const emptyFunction = EMPTY_FUNCTION;
  const compilerReference = COMPILER_REFERENCE;
  const templates = COMPILER_REFERENCE.template;
  const definitions = compilerReference.reference;

  const actionAcceptRpn = COMPILE_ACCEPT_RPN;
  const actionCreateCodeRef = COMPILE_CREATE_CODEREF;
  const actionInsertCodeRef = COMPILE_INSERT_CODEREF;
  const actionProcessCodeRef = COMPILE_PROCESS_CODEREF;

  const stack = [];
  const symbols = [];
  const settings = {
    vars: 0,
    reference: {},
    symbols: symbols
  };

  let action = actionAcceptRpn;
  let rpnIndex = 0;
  let rpn = null;
  let rpnCount;
  let unprocessed;
  let codeRef;
  let code;
  let reduce;
  let children;
  let child;
  let childIndex;
  let definition;
  let ruleId;
  let symbol;
  let template;
  let templateParams;
  let type;
  let stackLength = 0;

  let limit = 50;

  if (typeof subject !== TYPE_STRING) {
    return emptyFunction;
  }

  rpn = parse(subject);

  if (!rpn) {
    return emptyFunction;
  }

  rpnCount = rpn.length;

  for (; rpnCount;) {
    // get one rpn item
    if (action === actionAcceptRpn) {
      rpnCount--;
      unprocessed = rpn[rpnIndex++];
      action = actionCreateCodeRef;
    }

    // create coderef
    if (action === actionCreateCodeRef) {
      // reduce
      reduce = unprocessed.reduce;
      ruleId = unprocessed.ruleId;
      stackLength -= reduce;
      children = reduce
        ? stack.splice(stackLength, reduce)
        : [];

      codeRef = {
        rule: ruleId,
        type: null,
        ref: unprocessed.value || "undefined",
        code: ""
      };

      // process by definition
      definition = null;

      if (ruleId in definitions) {
        definition = definitions[ruleId];
        action = actionProcessCodeRef;
      }
      else {
        // console.log("no definition! ", ruleId);
        action = actionInsertCodeRef;
      }
      // console.log("rule ", ruleId, " definition: ", definition);
    }

    // process codeRef
    if (action === actionProcessCodeRef) {
      type = definition.type;
      code = unprocessed.value;
      symbol = "";

      // process child reuse
      if ("useChild" in definition) {
        childIndex = definition.useChild;
        if (!(childIndex in children)) {
          throw new Error(`Invalid child to reuse ${childIndex}`);
        }
        child = children[childIndex];
        code = child.code;
        type = child.type;
        symbol = child.ref;
      }
      // process code
      else if ("code" in definition) {
        // set generated code
        template = templates[definition.code];
        templateParams = [
          {
            type,
            code: "",
            ref: code
          }
        ];
        templateParams.push.apply(templateParams, children);
        code = createCode(
          settings,
          template,
          createCodeParams(
            settings,
            template.symbols,
            definition.params,
            templateParams
          )
        );

        symbol = code[0];
        code = code[1];
      }

      codeRef.type = type;
      codeRef.code = code || "";
      codeRef.ref = symbol || "";

      action = actionInsertCodeRef;
    }

    // insert codeRef
    if (action === actionInsertCodeRef) {
      stack[stackLength++] = codeRef;
      action = actionAcceptRpn;
      console.log("ref ", codeRef);
    }

    if (!--limit) {
      console.log("reached limit!");
      break;
    }
  }

  // console.log(JSON.stringify(stack, null, 3));

  if (stackLength) {
    console.log("code:\n\n" + stack[0].code);
  }

  return emptyFunction;
}
