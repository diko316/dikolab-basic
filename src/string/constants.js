export const STRING_TRIM_LEFT_REGEXP = /^[\s\uFEFF\xA0]+/;

export const STRING_TRIM_RIGHT_REGEXP = /[\s\uFEFF\xA0]+$/;

export const STRING_TRIM_REGEXP = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

export const TRIM_ERROR_NOT_STRING = "Unable to trim invalid string.";

export const SINGLE_QUOTE = "'";

export const ESCAPED_SINGLE_QUOTE = "\\'";

export const DOUBLE_QUOTE = "\"";

export const ESCAPED_DOUBLE_QUOTE = "\\\"";

export const DOUBLE_QUOTE_ESCAPE = /\\'|\\"|"/g;

export const DOUBLE_QUOTE_ESCAPE_ERROR = "Unable to escape invalid string.";

export const DEFAULT_PADSTRING = " ";
