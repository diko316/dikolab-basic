# Utilities

## Overview

The package supports basic utility functions that:

1. [Detects Javascript Data types](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html#native).
2. [Register destructors from lifecycle module](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html#lifecycle).


Please check the [API documentation](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html#native) for more details.

## Type Checkers

This module is useful for type checking and verifying type signatures.

### Scalar

*** [string(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-string) ***

*** [number(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-number) ***

*** [numeric(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-numeric) ***

*** [boolean(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-boolean) ***

*** [bigint(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-bigint) ***

*** [symbol(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-symbol) ***

*** [regexp(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-regexp) ***

*** [scalar(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-scalar) ***


### Native Object

*** [object(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-object) ***

*** [method(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-method) ***

*** [array(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-array) ***

*** [iteratable(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-iteratable) ***

*** [date(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-date) ***

*** [promise(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-promise) ***


### Data signature

*** [signature(subject: &ast;): boolean](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-signature) ***


## Lifecycle

**Destructor is also compatible with browser Javascript engines.**

*** [destructor(callback: function)](https://www.dikoconsunji.com/javascript/dikolab-basic/function/index.html#static-function-destructor) ***
