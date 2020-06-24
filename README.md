# @dikotech/basic

## Introduction

Tired of reinventing the wheel for new Javascript project.
I just want to lazily run the code below to create no Javascript Object.

```js
import { query } from "@dikolab/basic";
import * as package from "./package.json";

export const packageInfo = query(
  `
  package from ?;

  dependencies from getKeys(@package.dependencies);

  // I want to get my package information
  {
    name: @package.name,
    version: @package.version,

    deps: @dependencies
  }
  `,
  {
    0: package,
    getKeys: Object.keys
  }
);

```

### Usage

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

