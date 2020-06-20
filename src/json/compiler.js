import { parse } from "./parser";

import {
  EMPTY_FUNCTION,
  TYPE_STRING,
  TYPE_NUMBER,
  EMPTY_STRING
} from "../native/constants";

import { quoteEscapify } from "../string/format";

import COMPILER_REFERENCE from "./compiler-reference.json";

const TEMPLATES = COMPILER_REFERENCE.template;
const COMPILE_ACCEPT_RPN = 1;
const COMPILE_CREATE_CODEREF = 2;
const COMPILE_REUSE_CODEREF = 3;
const COMPILE_UPDATE_CODEREF = 4;
const COMPILE_INSERT_CODEREF = 5;

const SYMBOL_PREFIX = "v";
const WILD_CHAR = "*";
const CODE_PROCESS = [
  {
    name: "getter",
    reference: COMPILER_REFERENCE.preprocess
  },
  {
    name: "cast",
    valueResolve: true,
    reference: COMPILER_REFERENCE.typecast
  }
];

const CODE_TEMPLATE_PROCESS = [
  // ref
  {
    source: "return"
  },
  // get
  {
    source: "getter"
  },
  // code
  {
    source: "body",
    ln: true
  }
];

function createCode(settings, templateName, params) {
  const template = TEMPLATES[templateName];
  const processors = CODE_TEMPLATE_PROCESS;
  const empty = EMPTY_STRING;
  const result = [];

  let c = 0;
  let length = processors.length;
  let processor;
  let codes;
  let code;
  let cc;
  let clength;
  let generated;
  let glength;
  let source;

  let value;

  for (; length--; c++) {
    processor = processors[c];
    source = processor.source;
    value = empty;

    if (source in template) {
      generated = [];
      glength = 0;

      codes = template[source];
      cc = 0;
      clength = codes.length;
      for (; clength--; cc++) {
        code = codes[cc];
        generated[glength++] = code in params ? params[code] : code;
      }

      value = glength ? generated.join(empty) : empty;
    }

    result[c] = value;
  }

  return result;
}

function createArguments(settings, symbolCount, params, children, prime) {
  const args = {};
  const symbols = settings.symbols;
  const processors = CODE_PROCESS;
  const totalProcessors = processors.length;
  const symbolPrefix = SYMBOL_PREFIX;
  const subjects = prime
    ? children
      ? [prime].concat(children)
      : [prime]
    : children
      ? children.slice(0)
      : [];

  let argsCount = 0;
  let symbolLength = symbols.length;
  let counter;

  let vars = settings.vars;
  let c;
  let length;
  let definition;
  let source;
  let subject;
  let type;
  let symbol;
  let get;
  let ref;
  let code;

  let processor;
  let pc;
  let plength;
  let name;
  let value;
  let typeMatch;
  let matcher;
  let result;

  // apply symbols
  for (length = symbolCount; length--;) {
    symbol = symbols[symbolLength++] = `${symbolPrefix}${++vars}`;
    counter = argsCount++;

    args[`$${counter}`] = EMPTY_STRING;
    args[counter] = symbol;

    // save vars count
    if (!length) {
      settings.vars = vars;
    }
  }

  for (c = 0, length = params.length; length--; c++) {
    definition = params[c];
    counter = argsCount++;

    // expand parameter index
    if (typeof definition === TYPE_NUMBER) {
      definition = {
        child: definition
      };
    }

    // resolve source
    source = definition.child;
    if (!(source in subjects)) {
      console.warn(`Parameter source not found ${source}`);
      args[`$${counter}`] =
        args[`$${counter}|get`] = EMPTY_STRING;
      args[counter] = "undefined";
      continue;
    }

    subject = subjects[source];

    type = subject.type;
    ref = subject.ref;
    get = subject.get;
    code = subject.code;

    pc = 0;
    plength = totalProcessors;

    // preprocess
    for (; plength--; pc++) {
      processor = processors[pc];
      name = processor.name;

      if (!(name in definition)) {
        continue;
      }

      // get process reference
      value = processor.valueResolve ? definition[name] : name;
      matcher = processor.reference;
      if (!(value in matcher)) {
        continue;
      }

      // get template by type match
      matcher = matcher[value];
      typeMatch = type in matcher ? type : WILD_CHAR;
      if (!(typeMatch in matcher)) {
        continue;
      }

      // console.log(" processing args: ", name, " template ", matcher[typeMatch]);

      result = createCode(
        settings,
        matcher[typeMatch],
        {
          0: ref,
          "$0|get": get || ref,
          $0: code
        }
      );

      ref = result[0];
      get = result[1];
      code = result[2];
    }

    // add to args
    args[counter] = ref;
    args[`$${counter}|get`] = get || ref;
    args[`$${counter}`] = code && `${code}\n`;
  }

  return args;
}

export function compile(subject, params) {
  const emptyFunction = EMPTY_FUNCTION;
  const compilerReference = COMPILER_REFERENCE;
  const templates = TEMPLATES;
  const definitions = compilerReference.reference;

  const actionAcceptRpn = COMPILE_ACCEPT_RPN;
  const actionCreateCodeRef = COMPILE_CREATE_CODEREF;
  const actionReuseCodeRef = COMPILE_REUSE_CODEREF;
  const actionUpdateCodeRef = COMPILE_UPDATE_CODEREF;
  const actionInsertCodeRef = COMPILE_INSERT_CODEREF;

  const stack = [];
  const symbols = [];
  const settings = {
    vars: 0,
    reference: {},
    symbols: symbols,
    functions: [],
    functionIndex: {}
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
  let definition;
  let ruleId;
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
        get: "",
        code: ""
      };

      // process by definition
      definition = null;

      // default action if no definition
      action = actionInsertCodeRef;

      if (ruleId in definitions) {
        definition = definitions[ruleId];
        // set type
        type = definition.type;
        if (type) {
          codeRef.type = definition.type;
        }
        code = definition.code;

        switch (typeof code) {
        case TYPE_STRING:
          action = actionUpdateCodeRef;
          break;

        case TYPE_NUMBER:
          action = actionReuseCodeRef;
        }
      }
    }

    // reuse codeRef
    if (action === actionReuseCodeRef) {
      if (!(code in children)) {
        throw new Error(`Invalid child to reuse ${code}`);
      }

      child = children[code];
      type = child.type;
      if (type) {
        codeRef.type = type;
      }
      codeRef.ref = child.ref;
      codeRef.get = child.get;
      codeRef.code = child.code;

      action = actionInsertCodeRef;
    }

    // process codeRef
    if (action === actionUpdateCodeRef) {
      if (!(code in templates)) {
        throw new Error(`Invalid unable to find template ${code}`);
      }

      code = createCode(
        settings,
        code,
        createArguments(
          settings,
          templates[code].symbols || 0,
          definition.params || [],
          children,
          codeRef
        )
      );

      if (code) {
        codeRef.ref = code[0];
        codeRef.get = code[1];
        codeRef.code = code[2];
      }

      action = actionInsertCodeRef;
    }

    // insert codeRef
    if (action === actionInsertCodeRef) {
      stack[stackLength++] = codeRef;
      action = actionAcceptRpn;
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
