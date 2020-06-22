import { parse } from "./parser";

import {
  TYPE_STRING,
  TYPE_NUMBER,
  TYPE_UNDEFINED,
  EMPTY_STRING
} from "../native/constants";

import { quoteEscapify } from "../string/format";

import BUILD_REFERENCE from "./build-reference.json";

const TEMPLATES = BUILD_REFERENCE.template;
const BUILD_ACCEPT_RPN = 1;
const BUILD_CREATE_CODEREF = 2;
const BUILD_REUSE_CODEREF = 3;
const BUILD_UPDATE_CODEREF = 4;
const BUILD_INSERT_CODEREF = 5;

const SYMBOL_PREFIX = "v";
const TYPE_MIXED = "mixed";
const WILD_CHAR = "*";
const CODE_PROCESS = [
  {
    name: "getter",
    reference: BUILD_REFERENCE.preprocess
  },
  {
    name: "cast",
    valueResolve: true,
    reference: BUILD_REFERENCE.typecast
  }
];

const CODE_TEMPLATE_PROCESS = [
  // ref
  {
    source: "return"
  },
  // code
  {
    source: "body",
    ln: true
  }
];

const CODE_PARAMS = [
  "root",
  "util"
];

function createCode(settings, templateName, params) {
  const template = TEMPLATES[templateName];
  const helpers = template.helper;
  const requireList = template.requires;
  const referenceIndex = settings.reference;
  const references = settings.references;
  const requires = settings.requires;
  const requireIndex = settings.require;
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
  // let helpers;

  if (!template) {
    throw new Error(`TEMPLATE NOT FOUND ${templateName}`);
  }

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

  // register helper
  if (helpers) {
    clength = references.length;
    for (c = 0, length = helpers.length; length--; c++) {
      source = helpers[c];
      value = `helper:${source}`;

      // register
      if (!(value in referenceIndex)) {
        references[clength++] = [source, null];
        referenceIndex[value] = source;
      }
    }
  }

  // register requires
  if (requireList) {
    clength = requires.length;
    for (c = 0, length = requireList.length; length--; c++) {
      source = requireList[c];

      // register
      if (!(source in requireIndex)) {
        requires[clength++] = source;
        requireIndex[source] = true;
      }
    }
  }

  return result;
}

function createArguments(settings, symbolCount, params, children, prime) {
  const templates = TEMPLATES;
  const typeUndefined = TYPE_UNDEFINED;
  const typeNumber = TYPE_NUMBER;
  const empty = EMPTY_STRING;
  const wild = WILD_CHAR;
  const args = {};
  const symbols = settings.symbols;
  const referenceIndex = settings.reference;
  const references = settings.references;
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
  let referencesLength = references.length;
  let counter;

  let c;
  let length;
  let definition;
  let source;
  let subject;
  let type;
  let symbol;
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
  let rule;
  let template;

  // apply symbols
  for (length = symbolCount; length--;) {
    symbol = symbols[symbolLength++] = `${symbolPrefix}${symbolLength}`;
    counter = argsCount++;

    args[`$${counter}`] = empty;
    args[counter] = symbol;
  }

  for (c = 0, length = params.length; length--; c++) {
    definition = params[c];
    counter = argsCount++;

    // expand parameter index
    if (typeof definition === typeNumber) {
      definition = {
        child: definition
      };
    }

    // resolve source
    source = definition.child;
    if (!(source in subjects)) {
      args[`$${counter}`] = empty;
      args[counter] = typeUndefined;
      continue;
    }

    subject = subjects[source];

    rule = subject.rule;
    type = subject.type;
    ref = subject.ref;
    code = subject.code;

    // string-quote value
    if (definition.quote) {
      ref = `"${quoteEscapify(ref)}"`;
    }

    pc = 0;
    plength = totalProcessors;

    // preprocess

    // register references
    name = definition.as;
    switch (name) {
    case "autoref":
      ref = `${settings.vars++}`;
      name = "numref";

    // falls through
    case "numref":
    case "setref":
    case "ref":
    case "function":
      if (!(ref in referenceIndex)) {
        // create symbol
        symbol = symbols[symbolLength++] = `${symbolPrefix}${symbolLength}`;
        references[referencesLength++] = [ref, symbol, name];
        ref = referenceIndex[ref] = symbol;
      }
      else {
        ref = symbol = referenceIndex[ref];
      }
      break;
    }

    // post process
    for (; plength--; pc++) {
      processor = processors[pc];
      name = processor.name;

      if (!(name in definition)) {
        continue;
      }

      value = definition[name];

      // get process reference
      if (!processor.valueResolve) {
        value = name;
      }

      matcher = processor.reference;
      if (!(value in matcher)) {
        continue;
      }

      // get template by type match
      matcher = matcher[value];
      typeMatch = type in matcher ? type : wild;
      if (!(typeMatch in matcher)) {
        continue;
      }

      template = matcher[typeMatch];

      result = createCode(
        settings,
        template,
        createArguments(
          settings,
          templates[template].symbols || 0,
          [0],
          [],
          {
            rule: rule,
            type: type,
            ref: ref,
            code: code
          }
        )
      );

      ref = result[0];
      code = result[1];
    }

    // add to args
    args[counter] = ref;
    args[`$${counter}`] = code && `${code}\n`;
  }

  return args;
}

export function build(subject) {
  const buildReference = BUILD_REFERENCE;
  const templates = TEMPLATES;
  const definitions = buildReference.reference;

  const actionAcceptRpn = BUILD_ACCEPT_RPN;
  const actionCreateCodeRef = BUILD_CREATE_CODEREF;
  const actionReuseCodeRef = BUILD_REUSE_CODEREF;
  const actionUpdateCodeRef = BUILD_UPDATE_CODEREF;
  const actionInsertCodeRef = BUILD_INSERT_CODEREF;

  const typeString = TYPE_STRING;
  const typeNumber = TYPE_NUMBER;
  const typeUndefined = TYPE_UNDEFINED;
  const typeMixed = TYPE_MIXED;

  const stack = [];
  const symbols = [];
  const references = [];
  const requires = [];
  const codeParamIndex = CODE_PARAMS;
  const codeParams = [];
  const settings = {
    vars: 0,
    requires: requires,
    require: {},
    reference: {},
    references: references,
    symbols: symbols
  };
  const rpn = parse(subject);

  let action = actionAcceptRpn;
  let rpnIndex = 0;
  let rpnCount;
  let unprocessed;
  let codeRef;
  let codeParamsLength;
  let code;
  let codeLength;
  let reduce;
  let children;
  let child;
  let definition;
  let ruleId;
  let type;
  let stackLength = 0;
  let c;
  let length;
  let ref;
  let symbol;
  let params;

  if (!rpn) {
    return null;
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
        ref: unprocessed.value || typeUndefined,
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
        if (typeof type === typeNumber) {
          type = type in children ? children[type].type : null;
        }

        code = definition.code;

        switch (typeof code) {
        case typeString:
          action = actionUpdateCodeRef;
          break;

        case typeNumber:
          action = actionReuseCodeRef;
          break;

        default:
          codeRef.type = type || typeMixed;
        }
      }
    }

    // reuse codeRef
    if (action === actionReuseCodeRef) {
      if (!(code in children)) {
        throw new Error(`Invalid child to reuse ${code}`);
      }

      child = children[code];

      // finalize type
      codeRef.type = type || child.type || typeMixed;
      codeRef.ref = child.ref;
      codeRef.code = child.code;

      action = actionInsertCodeRef;
    }

    // process codeRef
    if (action === actionUpdateCodeRef) {
      if (!(code in templates)) {
        throw new Error(`Invalid unable to find template ${code}`);
      }

      // finalize type
      codeRef.type = type || typeMixed;

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
        codeRef.code = code[1];
      }

      action = actionInsertCodeRef;
    }

    // insert codeRef
    if (action === actionInsertCodeRef) {
      stack[stackLength++] = codeRef;
      action = actionAcceptRpn;
    }
  }

  if (!stackLength) {
    return null;
  }

  // generate code
  code = [];
  codeLength = 0;
  codeParamsLength = 0;

  // create requires
  for (c = 0, length = requires.length; length--; c++) {
    ref = requires[c];
    definition = `require${ref}`;
    if (definition in templates) {
      codeRef = createCode(
        settings,
        definition,
        {
          0: ref
        }
      );

      code[codeLength++] = codeRef[1];
    }
    // set params
    if (codeParamIndex.indexOf(ref) !== -1) {
      codeParams[codeParamsLength++] = ref;
    }
  }

  // create references
  for (c = 0, length = references.length; length--; c++) {
    definition = references[c];
    ref = definition[0];
    symbol = definition[1];
    action = definition[2];

    // should be assigned as symbol constant
    codeRef = null;
    params = {
      0: symbol,
      1: `"${quoteEscapify(ref)}"`
    };

    if (!symbol) {
      params[0] = ref;
    }

    switch (action) {
    case "setref":
      child = "defineref";
      break;

    case "numref":
      params[1] = ref;

    // falls through
    case "ref":
    case "function":
      child = "defineref";
      break;

    default:
      child = "defineutil";
    }

    codeRef = createCode(
      settings,
      child,
      params
    );
    code[codeLength++] = codeRef[1];
  }

  // insert code body
  code[codeLength++] = stack[0].code;

  return [
    codeParams.join(", "),
    code.join("\n")
  ];
}
