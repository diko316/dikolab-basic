# [@dikolab/basic](https://www.dikoconsunji.com/javascript/dikolab-basic)


## Motivation

So tired of reinventing the wheel every time there's new Javascript project.

And now, I'm feeling lazy and just want to create a Javascript Object using the code below.

```js
import { query } from "@dikolab/basic";
import * as package from "./package.json";

export const packageInfo = query(
  `
  /* define @package */
  package from ?;

  /* define @dependencies */
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

## Installation

Install using NPM.

```sh
npm install --save @dikolab/basic

```

Or, directly use the package via CDN [repo](https://www.dikoconsunji.com/cdn/js/dikolab/basic/latest/basic.js)
by embedding the code below in your HTML.

```html

<!-- using latest version -->
<script type="text/javascript" src="https://www.dikoconsunji.com/cdn/js/dikolab/basic/latest/basic.js"></script>


<!-- using specific version -->
<script type="text/javascript" src="https://www.dikoconsunji.com/cdn/js/dikolab/basic/0.0.2/basic.js"></script>


```

## Usage

### CDN

If using CDN, the utility functions are accessible via **`diko$basic`** global variable.

```html

<script type="text/javascript">
  // sample employees
  var employees = [
    {
      id: 1,
      name: "diko"
    },
    {
      id: 2,
      name: "server generated"
    }
  ];

  // show employee names
  console.log(
    diko$basic.query(".[].name", employees)
  );
</script>


```

---

### CommonJS

NPM or YARN installed package may `require()` the module directly the CommonJS way.

Use this method for vanilla NodeJS or Browserify transpiled project.

```js

const basic = require("@dikolab/basic");

function hasProperty(param, name) {
  return basic.object(param) && basic.contains(param, name);
}

exports.hasProperty = hasProperty;


```

---

### ES Module

Rollup, Webpack/Babel, TypeScript, Babel, and etc transpiled project
may use ES6 module `import` directly if supported.

```js

import {
  object,
  contains
} from "@dikolab/basic";

export function hasProperty(param, name) {
  return object(param) && contains(param, name);
}


```

---

### Further Reading

Main documentation can be found in [https://www.dikoconsunji.com/javascript/dikolab-basic](https://www.dikoconsunji.com/javascript/dikolab-basic).


Detailed API documentation is located in [https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html](https://www.dikoconsunji.com/javascript/dikolab-basic/identifiers.html)


What's new and version release is located in [https://www.dikoconsunji.com/javascript/dikolab-basic/manual/whats-new.html](https://www.dikoconsunji.com/javascript/dikolab-basic/manual/whats-new.html)


## Contributors

None.


## Backers

None.

## Sponsors

None.

## I just enjoy my hobby

Stay tune for more [documentation](https://www.dikoconsunji.com/javascript/dikolab-basic) and functionality.

