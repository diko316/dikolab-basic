# @dikolab/basic

## Motivation

Tired of reinventing the wheel in every new Javascript project.

I'm feeling lazy and just want to create a Javascript Object using the code below.

```js
import { query } from "@dikolab/basic";
import * as package from "./package.json";

export const packageInfo = query(
  `
  package from ?;

  dependencies from keys(@package.dependencies);

  // I want to get my package information
  {
    name: @package.name,
    version: @package.version,

    deps: @dependencies
  }
  `,
  [
    package
  ]
);

```

## Usage

Install using NPM

```sh

npm install --save @dikolab/basic

```

May import functions using ES6 module import.

```js

import {
  object,
  contains
} from "@dikolab/basic";

export function hasProperty(param, name) {
  return object(param) && contains(param, name);
}

```

Or, CommonJS import.

```js

const basic = require("@dikolab/basic");

function hasProperty(param, name) {
  return basic.object(param) && basic.contains(param, name);
}

exports.hasProperty = hasProperty;

```

## Contributors

None.


## Backers

None.

## Sponsors

None.

## I just enjoy my hobby

Stay tune for more [documentation](https://dikoconsunji.com/javascript/dikolab-basic) and functionality.
