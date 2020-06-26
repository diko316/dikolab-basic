# JSON Query Language

## Usage

### Importing `query` function from @dikolab/basic

CommonJS

```js
const query = require("@dikolab/basic").query;
```

ECMAScript module

```js
import { query } from "@dikolab/basic";
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
      "name": "name2",
      "language": [
        "es"
      ]
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

#### Extract and Filter

```js
// returns [{ id: 2,...}] since data.id === 1 has no "es" language
query(
  `
  data[] | ~ .language is: "es"

  // alternatively, you can use other built-in filter:
  //
  // language among: "es"
  //   or  
  // language in: ["es"]
  `
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
    .3.data[0].id = ?,
    @3.data[1].name = ?,
    .[3].data[1].language[] = ?
  ]
  `,
  [
    42,
    "updated name",
    "en",
    object
  ]
);

// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
// data[1] will now contain { id: 2, name: "updated name", language: ["en"]}
// then, returns { "updatedId": 42, "updatedName": "updated name", "updatedLanguage": "en" }
query(
  `
  {
    updatedId: @3.data[0].id = ?,
    updatedName: @3.data[1].name = ?,
    updatedLanguage: @3.data[1].language[] = ?
  }
  `,
  [
    42,
    "updated name",
    "en",
    object
  ]
);

// creates new item in "data" array indexed by "2".
// data[2] will now contain { id: 42, name: "name1", language: ["en"]}
// then, returns { "updatedId": 42, "updatedName": "updated name", "updatedLanguage": "en" }
query(
  `
  {
    updatedId: .3.data[2].id = ?,
    updatedName: .[3].data[2].name = ?,
    updatedLanguage: @3.data[2].language[] = ?
  }
  `,
  [
    42,
    "updated name",
    "en",
    object
  ]
);
```

#### Unset value

**Simple remove property**
```js

// removes "message" property.
// returns true if successfully deleted "message" property.
query(
  "delete message",
  object
);


**Multiple remove property**

// removes "message" property.
//  then, removes "name" property in data[0].
//  then, removes "language" property in data[0].
//  then, pops "0" index in data[0].language array.
// returns true if last delete expression is successful.
query(
  `
    delete message,
          data[0].name,
          data[0].language,
          data[0];
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

  # or, multiple expression separated by `;`
  |
    `expression`;

      [
        ... `expression`;
        [`expression`]
      ]

  # the last expression
  #   1. may or may not omit `;`
  #   2. and will be returned as query result.



```

### References

**Using references**

```
// reference declaration

myReference from @1.data[1].value;
firstElement from .[1].data[0];
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
Mixed | **`.`** | `myFunction(.); .property = 1; .` | Contains `targetObject` as `root` object which is passed when calling `query(myquery, targetObject)` function.
Mixed | **`?`** | data[**?**]<br><br>data[0].id = **?** | Question mark **?** contains any value defined outside the query.<br>Value in **?** contains value listed in **targetobject** Array argument when calling `query(myquery, `**targetobject**`)` function in order they appear in the query code.<br><br>For example, the first question mark will contain **"my value"** string if function is executed like this `query(".[1].data = ?", [`**"my value"**`, object])`
Mixed | **`@`**<br><br>**`@reference`**<br><br>**`@number`** | myReference *from* data[1];<br>value *from* **@myReference**.value;<br>another *from* ?;<br><br>{<br>&nbsp;&nbsp;&nbsp;&nbsp;name: **@myReference**.name,<br>&nbsp;&nbsp;&nbsp;&nbsp;value: 1 + **@value**,<br>&nbsp;&nbsp;&nbsp;&nbsp;scope: **@**,<br>&nbsp;&nbsp;&nbsp;&nbsp;custom: **@1**<br>} | Uses value referenced from **from** declaration. <br><br>**@** can also be used to reference root object if not followed by identifier.<br><br>**@** can represent **?** variable when it's followed by numeric identifier such as **@1**, or **@3**.


### Function Call


Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`ident()`**<br>**`ident(expression[, ...expression])`** | `func(., .rows[])` |Calls custom function from `root` object property.


### Filters


Result Type | Operator | Example | Description
--- | --- | --- | ---
Array | **`expression`** &#124; **`ident`**<br>**`expression`** &#124; **`ident : expression[, ...expression]`** | `.` &#124; ` myfilter: ?` | Calls custom filter from `root` object property.
Array | **`expression`** &#124; **`~`** **`JsonPath...`** **`ident`**<br>**`expression`** &#124; **`~`** **`JsonPath...`** **`ident : expression[, ...expression]`** | `.data[]` &#124; `~ country[].value in: ["US", "AL"]` | Granular filtering based from subsequent Json Queries.<br>Like function and filters, they can be custom made as `root` object property.


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
Boolean | **`==`** | 1 **`==`** 2 | Equal.
Boolean | **`===`** | 1 **`===`** 2 | Strict Equal.
Boolean | **`!=`** | 1 **`!=`** 2 | Not Equal.
Boolean | **`!==`** | 1 **`!==`** 2 | Strict Not Equal.
Boolean | **`>`** | 1 **`>`** 2 | Greater than.
Boolean | **`>=`** | 1 **`>=`** 2 | Greater than or equal to.
Boolean | **`<`** | 1 **`<`** 2 | Lesser than.
Boolean | **`<=`** | 1 **`<=`** 2 | Lesser than or equal to.
Boolean | **`=~`** | name **`=~`** /^diko/<br><br>name **`=~`** "diko" | String pattern search.


### Logical Operators

 Result Type | Operator | Example | Description
--- | --- | --- | ---
Boolean | **`&&`** | 1 **`&&`** 2 | Logical And.
Boolean | **&#124;&#124;** | name **&#124;&#124;** ? | Logical Or.



### Ternary Condition Operator

 Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | ***condition*** **`?`** ***expression1*** **`:`** ***expression2*** | `.data.id === 3` <br> **`?`** `rows[0..5]` <br>**`:`** `rows[0, 6..10]` | Ternary condition where expression after `?` is returned if condition is truthy. Returns expression after `:` if condition is falsy.

### Assignment

Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`=`** | data[0].value **`=`** "value" | Assigns **"value"** to **data[0].value** expression. <br>Take note that if zero "0" don't exist, an empty object will be created and assigned to that property/index for you.

### Json Path

 Operator | Example | Description
--- | --- | ---
**`.key`**<br>**`key`** | **`@.name`**<br>**`.1`**<br>**`id`**<br>**`."mydata"`** | Selects a value based on object property or array index defined by `key`.
**`.*`** | **`.*`** | Selects all object properties or array items.
**`[]`**<br>**`[*]`** | **`.[*]`**<br>**`rows[]`** | Selects all object properties or array items.<br><br>**Setter query** that ends with this operator will append an item to context array. (e.g. `rows[]={id: 2}` appends `{id:2}` to `rows` array.)
**`[key]`** | **`.[data]`**<br>**`@["id"]`**<br>**`.rows[?]`** | Selects a value based on object property or array index defined by `key`. also an alternative to `.key` operator.
**`[key, range, ...]`** | **`?[name, id, 0..10]`**<br>**`.[0,2,4..9]`** | Selects matching object properties or array index defined by multiple combination of `key`, and `range`.<br><br>**Range** is expressed in **`[start index] .. [end index]`** that may be useful for slicing arrays.