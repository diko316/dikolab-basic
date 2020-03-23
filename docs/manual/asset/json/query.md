# JSON Query

## Usage

### Acquire `query` function from @dikotech/basic

CommonJS

```js
const query = require("@dikotech/basic").query;
```

ECMAScript module

```js
import { query } from "@dikotech/basic";
```

### `get` query

#### data.json file sample data
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "name": "name1",
      "language": [
        "en",
        "fr",
        1,
        "de"
      ]
    },
    {
      "id": 2,
      "name": "name2"
    }
  ]
}
```

#### Simple extract value 
```js
const object = require("data.json");

// returns 1
query(
  object,
  "get data[0].id"
);
```

#### Compose Object
```js
// returns { "found": 1 }
query(
  object,
`get
  data[0].id as found,
  data[1].name as nextName
`
);
```

#### List Filter
```js
// returns [ "en", "fr", "de" ]
query(
  object,
  "get data[]:[name=name1].language[]:[!=1]"
);
```

#### Substitution
```js
// returns [ "en", "fr", "de" ]
query(
  object,
  "get data[]:[name=?].language[]:[!=?]",
  [
    "name1",
    1
  ]
);
```

#### Custom Function call
```js
// returns [ "en", "fr", "de" ]
query(
  object,
  "get data[]:[name=?].language[]:customFilter()",
  {
    values: [
      "name1"
    ],
    /**
     *
     * @param {*} value currently selected item.
     *            may also be an item iterated from an array collection or
     *            property iterated from object.
     * @param {string|number|null} key zero based index position if array collection.
     *            or, property name of parent object.
     *            or, null if parent object is not an array or object.
     * @param {*} parent current parent object selected.
     *            It may contain array, object, or null.
     * @param {...*} otherArguments other arguments passed from query expression.
     *            otherArguments[0] may contain "test" value if called in query: `:customFilter(test)`
     * @returns {boolean|*} return false to exclude from selection
     */
    customFilter(value, key, parent, ...otherArguments) {
      return typeof value === 'string';
    }
  }
);
```


### `set` query

#### data.json file sample data
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "name": "name1",
      "language": [
        "en",
        "fr"
      ]
    },
    {
      "id": 2,
      "name": "name2"
    }
  ]
}
```

#### Simple set
```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
query(
  object,
  "set data[0].id is 42"
);
```

#### Multiple set
```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// data[1] will now contain { id: 2, name: "updated name", language: ["en"]}
query(
  object,
`
set
  data[0].id is ?,
  data[1].name is ?,
  data[1].language[] is ?
  `,
  [
    42,
    "updated name",
    "en"
  ]
);
```

#### Transform set
```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// data[1] will now contain { id: 2, name: "updated name"}
query(
  object,
`
set
  data[0].id is ?,
  data[1].name is :customizeValue(?)
  `,
  {
    values: [
      42,
      "updated name"
    ],
    /**
     *
     * @param {*} value currently selected item.
     *            may also be an item iterated from an array collection or
     *            property iterated from object.
     * @param {string|number|null} key zero based index position if array collection.
     *            or, property name of parent object.
     *            or, null if parent object is not an array or object.
     * @param {*} parent current parent object selected.
     *            It may contain array, object, or null.
     * @param {...*} otherArguments other arguments passed from query expression.
     *            otherArguments[0] may contain "test" value if called in query: `:customFilter(test)`
     * @returns {undefined|*} return transformed value.
     *            when used in "set" assignment query, returning undefined will:
     *              remove item from parent array or object.
     *              will do nothing if key, and parent is not array or object
     */
    customizeValue(value, key, parent, ...otherArguments) {
      if (value === "name2") {
        return otherArguments[0];
      }

      return value;
    }
  }
);
```

### `unset` query

#### data.json file sample data
```json
{
  "message": "Ok",
  "data": [
    {
      "id": 1,
      "name": "name1",
      "language": [
        "en",
        "fr"
      ]
    },
    {
      "id": 2,
      "name": "name2"
    }
  ]
}
```

#### Simple remove array items

```js
// data[1] will be removed as 2 up to 10 do not exist.
query(
  object,
  'unset data[1..10]'
);
```

#### Remove Guard

Guard operator `only [expression] is [values]`.

```js
// removes data[0] since it has name property containing "name1" value.
query(
  object,
  'unset data[] only name is [name1]'
);
```

#### Remove Guard operator with multiple value match

```js
// removes data[0] since it has language property array containing "en", or "fr" value.
query(
  object,
  'unset data[] only language[] is [en, fr, 1]'
);
```

#### Remove Guard operator with substitution
```js
// removes data[0] since it has language property array containing "en", or "fr" value.
query(
  object,
  'unset data[] only language[] is [?, ?, ?]',
  [
    "en",
    "fr",
    1
  ]
);
```

#### Remove Guard operator with multiple value substitution
```js
query(
  object,
  'unset data[] only language[] is ?',
  [
    ["en", "fr", 1]
  ]
);
```

## Query Language

Supported Lexical Structures.

### get Lexical Structure

```
get `expression` [as `identifier`]
    ...
    , `expression` [as `identifier`]
```

### set Lexical Structure

```
set `expression` is `value`
  ...
  , `expression` is `value`
```

### unset Lexical Structure

```
unset `expression` [only `expression` as `values`]
    ...
    , `expresson` [only `expression` as `values`]
```

### expression Lexical Rule

#### Object property access expression

```
objectAccess:

  [`propertyName`]

  .`propertyName`
```

```
expression:

  `property`

  `property` ... `objectAccess`

```

#### Array item access expression

```
indexRange:

  `number`

  `number`-`number`

```


```
expression:

  [`indexRange`]

  [`indexRange` ...,`indexRange`]

```

#### Filter conditions

```
accessExpression:

  `property`

  `numeric_index`

```

```
valueExpression:

  `string`

  `number`

  `regex`

```

```
operator:

  `=`

  `!=`

  `~=`

  `>`

  `>=`

  `<`

  `>=`

```


```
expression:

  :[`operator` `valueExpression`]

  :[`operator` `valueExpression` ... ,`valueExpression`]

  :[`accessExpression` `operator` `valueExpression`]

  :[`accessExpression` `operator` `valueExpression` ... ,`valueExpression`]

```

#### Filter function call

```
arguments:

  `string`

  `number`

  `object`

  `array`

```

```
expression:

  :`functionName`()

  :`functionName`(`arguments`)

  :`functionName`(`arguments` ..., `arguments`)

```
