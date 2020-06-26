# Unicode

## Overview

This module also provides a handful support for treating Strings as UTF-8 allowing UTF-8 aware String manipulation and formatting via
[service functions](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html#unicode) or
[UTF 8 class](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html).


API documentation cheatsheet is found in the following:

1. [service functions](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html#unicode).
2. [UTF 8 class](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html)


## Counting and Traverse

*** [eachUnicode(subject: string, callback: eachCodePointCallback): number]() ***

*** [unicodeCount(subject: string | Utf): number]() ***


## Type Juggle


### To String/s and Numbers

*** [codePointToString(codes: ...number[]): string](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-codePointToString) ***

*** [stringToCodePoints(subject: string): number[]](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-stringToCodePoints) ***

*** [stringToUnicodes(subject: string): string[]](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-stringToUnicodes) ***


### To Utf Class

*** [codePointsToUtf(codes: number[]): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-codePointsToUtf) ***

*** [unicodify(subject: &ast;, defaultValue: &ast;): Utf | &ast;](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-unicodify) ***


## Utf Class


### Constructor

*** [constructor(subject: string | Utf)](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-constructor-constructor) ***


### Instance stats and handling

*** [clone(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-clone) ***

*** [localeCompare(compareString: string | Utf, locales: string, options: object): number](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-localeCompare) ***


### Character/Code Point/Word Search

*** [charAt(index: number): string](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-charAt) ***

*** [codePointAt(index: number): number](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-codePointAt) ***

*** [includes(keyword: string | Utf, position: number): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-includes) ***


*** [indexOf(searchValue: string | Utf, fromIndex: number): number](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-indexOf) ***

*** [lastIndexOf(searchValue: string | Utf, fromIndex: number): number](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-lastIndexOf) ***

*** [match(pattern: RegExp): Utf[] | null](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-match) ***

*** [search(pattern: RegExp): number](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-search) ***


### String Manipulation

*** [concat(subject: ...(string|Utf)): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-concat) ***

*** [padEnd(targetLength: number, padString: string | Utf): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-padEnd) ***

*** [padStart(targetLength: number, padString: string | Utf): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-padStart) ***

*** [repeat(count: number): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-repeat) ***

*** [replace(pattern: string | Utf | RegExp, replacement: string | Utf | stringReplaceCallback): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-replace) ***

*** [slice(begin: *, end: *): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-slice) ***

*** [split(separator: string | RegExp | Utf, limit: number): Utf[]](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-split) ***

*** [substring(begin: number, end: number): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-substring) ***

*** [trim(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-trim) ***

*** [trimEnd(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-trimEnd) ***

*** [trimStart(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-trimStart) ***


### Type Juggle

*** [toArray(): string[]](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toArray) ***

*** [toJSON(): string](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toJSON) ***

*** [toLocaleLowerCase(locale: string | string[]): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toLocaleLowerCase) ***

*** [toLocaleUpperCase(locale: string | string[]): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toLocaleUpperCase) ***

*** [toLowerCase(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toLowerCase) ***

*** [toPoints(): number[]](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toPoints) ***

*** [toString(): string](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toString) ***

*** [toUpperCase(): Utf](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-toUpperCase) ***

*** [valueOf(): string](https://www.dikoconsunji.com/javascript/dikolab-basic/class/src/unicode/utf.class.js~Utf.html#instance-method-valueOf) ***
