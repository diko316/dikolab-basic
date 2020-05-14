# JSON Query

## Usage

### Importing `query` function from @dikotech/basic

CommonJS

```js
const query = require("@dikotech/basic").query;
```

ECMAScript module

```js
import { query } from "@dikotech/basic";
```
### Simple Query

```js
// returns 9
query(
  "(1 + 2) * 3"
);

// returns false
query(
  "5 > 6"
);

// returns true
query(
  "5 <= 6"
);
```

### Select/Extract JSON data

**With sample JSON**

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

#### Simple Extract data

```js
// returns 1
query(
  "data[0].id",
  object
);
```

#### Extract and Compose

**Composing array/list**

```js
// returns [ "en", "fr", "de" ]
query(
  `
  [
    data[0].language[0],
    data[0].language[1],
    data[0].language[3]
  ]
  `,
  object
);
```

**Composing object**

```js
//  returns { "found": 1, "nextName": "name1" }
query(
  `
  {
    found: data[0].id,
    nextName: data[1].name
  }
  `,
  object
);
```

### Manipulate JSON data

**With sample JSON**

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

#### Set value

**Simple set value**

```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// then, returns 42
query(
  "data[0].id = 42",
  object
);
```

**Multiple set value**

```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// data[1] will now contain { id: 2, name: "updated name", language: ["en"]}
// then, returns [42, "updated name", "en" ]
query(
  `
  [
    data[0].id = ?,
    data[1].name = ?,
    data[1].language[] = ?
  ]
  `,
  object,
  [
    42,
    "updated name",
    "en"
  ]
);

// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// data[1] will now contain { id: 2, name: "updated name", language: ["en"]}
// then, returns { "updatedId": 42, "updatedName": "updated name", "updatedLanguage": "en" }
query(
  `
  {
    updatedId: data[0].id = ?,
    updatedName: data[1].name = ?,
    updatedLanguage: data[1].language[] = ?
  }
  `,
  object,
  [
    42,
    "updated name",
    "en"
  ]
);

// creates new item in "data" array indexed by "2".
// data[2] will now contain { id: 42, name: "name1", language: ["en"]}
// then, returns { "updatedId": 42, "updatedName": "updated name", "updatedLanguage": "en" }
query(
  `
  {
    updatedId: data[2].id = ?,
    updatedName: data[2].name = ?,
    updatedLanguage: data[2].language[] = ?
  }
  `,
  object,
  [
    42,
    "updated name",
    "en"
  ]
);
```

#### Unset value

**Simple remove property**
```js

// removes "message" property.
// returns last value "Ok".
query(
  "delete message",
  object
);

// removes "message" property.
//  then, removes "name" property in data[0].
//  then, removes "language" property in data[0].
//  then, pops "0" index in data[0].language array.
// returns old values [ "Ok", "name1", "en" ].
query(
  `
  [
    delete message,
    delete data[0].name,
    delete data[0].language,
    delete data[0]
  ]
  `,
  object
);
```

## Query Language

Supported Lexical Structures.

### Lexical Structure

```
#####################################
# Reference declarations (optional)
#####################################

[`identifier` from `expression`;]
  ...
  [`identifier` from `expression`;]


#####################################
# Main expression (required)
#####################################

# return result of `expression`
`expression`

  # or, return composed array
  |
    `[`
      `expression`
      [, `expression`]
      [, `expression`]
    `]`

  # or, return composed object
  |
    `{`
      `identifier`: `expression`
      [, `identifier`: `expression`]
      [, `identifier`: `expression`]
    `}`


```

### References

**Using references**

```
// reference declaration

myReference from data[1].value;
firstElement from data[0];
customValue from ?;

// using reference with @
{
  count: @myReference.length,
  first: @firstElement,
  value: @customValue
}
```

### Scalar and Literals

Scalars are literally declared as seen in the examples.


Type | Example | Description
--- | --- | ---
Integer | `10`<br><br>`-2`<br><br>`+500` | Whole number.
Float | `.5`<br><br>`1.5`<br><br>`-0.1` | Number with precision
Percent | `-1%`<br><br>`210%` | Float multiplied by .01
String | `"double quote"`<br><br>`'single quote'`<br><br>`'\n escaped next line'` | Enclosed in double quote and single quote


### Array/List

Lists are internally Javascript Array instance.

It can be composed by enclosing items with brackets `[]` like: `[1, 2, "last item"]`.

Result Type | Example | Description
--- | --- | ---
Array | `[1,2,3]`<br><br>`[`<br>&nbsp;&nbsp;&nbsp;&nbsp;`"diko",`<br>&nbsp;&nbsp;&nbsp;&nbsp;`3,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`@myValue`<br>`]` | Zero-based indexed list of values where first item index is 0, and nth for next consecutive items.


### Object

Objects are internal Javascript Object instance.

It can be composed by enclosing properties with braces `{}`.

Properties are named with `identifiers` followed by colon `:`, then an `expression` representing value of the property.

```js
{
  first: 1,
  seconds: 2,
  last: "last item"
}
```


Result Type | Example | Description
--- | --- | ---
Object | { first: 1, seconds: 2 , third: 3 }<br><br>{<br>&nbsp;&nbsp;&nbsp;&nbsp;name: "diko",<br>&nbsp;&nbsp;&nbsp;&nbsp;"count": 3,<br>&nbsp;&nbsp;&nbsp;&nbsp;value: @myValue<br>} | Struct data containing properties defined using **:** operator and **identifier** as property name.

### Variables


Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`?`** | data[**?**]<br><br>data[0].id = **?** | Question mark **?** contains any value defined outside the query.<br>Value in **?** contains value listed in **variables** Array argument when calling `query(myquery, targetobject, `**variables**`)` function in order they appear in the query code.<br><br>For example, the first question mark will contain **"my value"** string if function is executed like this `query("data.?", target, [`**"my value"**`, 1])`
Mixed | **`@`** | myReference *from* data[1];<br>value *from* **@myReference**.value;<br>another *from* ?;<br><br>{<br>&nbsp;&nbsp;&nbsp;&nbsp;name: **@myReference**.name,<br>&nbsp;&nbsp;&nbsp;&nbsp;value: 1 + **@value**,<br>&nbsp;&nbsp;&nbsp;&nbsp;scope: **@**,<br>&nbsp;&nbsp;&nbsp;&nbsp;custom: **@1**<br>} | Uses value referenced from **from** declaration. <br><br>**@** can also be used to reference root object if not followed by identifier.<br><br>**@** can represent **?** variable when it's followed by numeric identifier such as **@1**, or **@3**.


### Arithmetic

 Result Type | Operator | Example | Description
--- | --- | --- | ---
Number or,<br>String | **`+`** | 1 **`+`** 2 | Addition.<br>But, result may be a **concatenated string** if one or all of the operands is a **string**.
Number | **`-`** | 1 **`-`** 2 | Subtraction.
Number | **`*`** | 1 **`*`** 2 | Multiplication.
Number | **`/`** | 1 **`/`** 2 | Division.
Number | **`%`** | 1 **`%`** 2 | Modulo Division. Resturns remainder of division operation

### Conditional

 Result Type | Operator | Example | Description
--- | --- | --- | ---
Boolean | **`==`** | 1 **`==`** 2 | Modulo Division.
Boolean | **`>`** | 1 **`>`** 2 | Addition.
Boolean | **`>=`** | 1 **`>=`** 2 | Subtraction.
Boolean | **`<`** | 1 **`<`** 2 | Multiplication.
Boolean | **`<=`** | 1 **`<=`** 2 | Division.

### Assignment

Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`=`** | data[0].value **`=`** "value" | Assigns **"value"** to **data[0].value** expression. <br>Take note that if zero "0" don't exist, zero index will be created with empty object.

### Object Query

Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`.`** | data **`.`** propertyName<br>data **`.`** "propertyName" **`.`** target = ? | **Extract mode:**<br>Retrieves property of Object.<br><br>**Assign mode:**<br>Assign/Populate property value of the Object.
Mixed | **`[]`** | data **`[1]`**<br><br>data **`[propertyName]`** = ?<br><br>data **`[1..10, 20]`**<br><br>data **`[]`** is ? | **Extract mode:**<br>Retrieves property of an object or item of an Array list if there is only one value or identifier inside **`[]`**.<br><br>It can also act as object property or list index filter if **`[]`** contains none (e.g. **`[]`**), or two or more values (e.g. **`[1, 5, name]`**), or number range (e.g. **`[10..25]`**).<br>The result of list index or object property filter with **`[]`** operator end up as list array.<br><br>**Assign mode:**<br>Assign/populate list item or object property value. May also do multiple assignment of values when **`[]`** operator results in object property or list index filter.
Mixed | **`:`** | propertyName **:** data[0] | **Compose mode:**<br>Assign property value of an object with the given identifier.