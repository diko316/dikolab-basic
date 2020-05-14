export const TOKENIZER_START_STATE = "initial";

export const TOKENIZER_WILDCARD = ":*";

export const TOKENIZER_KEYWORD_LIST = [
  "get",
  "set",
  "unset",
  "is",
  "as",
  "only"
];

export const DOUBLE_QUOTE = "\"";

export const SINGLE_QUOTE = "\\\"";

export const ESCAPED_DOUBLE_QUOTE = "\\\"";

export const ESCAPED_SINGLE_QUOTE = "\\'";

export const LINE_CHARACTER = "\n";

export const SINGLE_TO_DOUBLE_QUOTE = /"|\\'/g;

export const QUOTE_ESCAPE_REGEXP = /\\['"]|['"]/g;

export const INVALID_TOKEN = "Invalid token";

export const INVALID_OPERAND_TOKEN = "Invalid operand";

export const INVALID_SEPARATOR_TOKEN = "Invalid arguments separator";
