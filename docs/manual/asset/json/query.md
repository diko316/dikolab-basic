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
  (
    data[0].language[0],
    data[0].language[1],
    data[0].language[3]
  )
  `,
  object
);
```

**Composing object**

```js
//  returns { "found": 1, "nextName": "name1" }
query(
  `
  (
    data[0].id as found,
    data[1].name as nextName
  )
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
  "data[0].id is 42",
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
  (
    data[0].id is ?,
    data[1].name is ?,
    data[1].language[] is ?
  )
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
  (
    data[0].id is ? as updatedId,
    data[1].name is ? as updatedName,
    data[1].language[] is ? as updatedLanguage
  )
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
  (
    data[2].id is ? as updatedId,
    data[2].name is ? as updatedName,
    data[2].language[] is ? as updatedLanguage
  )
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
  "! message",
  object
);

// removes "message" property.
//  then, removes "name" property in data[0].
//  then, removes "language" property in data[0].
//  then, pops "0" index in data[0].language array.
// returns old values [ "Ok", "name1", "en" ].
query(
  `
  (
    ! message,
    data[0] ! name,
    data[0] ! language ! 0
  )
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

`expression` [as `identifier`] [is `expression`]
    ...
    , `expression` [as `identifier`] [is `expression`]


```

### References

**Using references**

```
// reference declaration

myReference from data[1].value;

// using reference with @

@myReference.length
```

### Scalar and Literals

Scalars are literally declared as seen in the examples.


Type | Example | Description
--- | --- | ---
Integer | `10`<br><br>`-2`<br><br>`+500` | Whole number.
Float | `.5`<br><br>`1.5`<br><br>`-0.1` | Number with precision
Percent | `-1%`<br><br>`210%` | Float multiplied by .01
String | `"double quote"`<br><br>`'single quote'`<br><br>`'\n escaped next line'` | Enclosed in double quote and single quote


### List

Lists are internally Javascript Array instance.

It can be composed using parenthesis `(1, 2, "last item")`.

Result Type | Example | Description
--- | --- | ---
Array | `(1,2,3)`<br><br>`(`<br>&nbsp;&nbsp;&nbsp;&nbsp;`"diko",`<br>&nbsp;&nbsp;&nbsp;&nbsp;`3,`<br>&nbsp;&nbsp;&nbsp;&nbsp;`@myValue`<br>`)` | Zero-based indexed list of values where first item index is 0, and nth for next consecutive items.


### Object

Objects are internally Javascript Object instance.

It can be composed using parenthesis with properties defined using `as` operator `(1 as first, 2 as seconds, "last item" as last)`.


Result Type | Example | Description
--- | --- | ---
Object | (1 **as** first, 2 **as** second, 3 **as** third)<br><br>(<br>&nbsp;&nbsp;&nbsp;&nbsp;"diko" **as** name,<br>&nbsp;&nbsp;&nbsp;&nbsp;3 **as** count,<br>&nbsp;&nbsp;&nbsp;&nbsp;@myValue **as** value<br>) | Struct data containing properties defined using **as** operator and **identifier** as property name.

### Variables


Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`?`** | data[**?**]<br><br>data[0].id = **?** | Question mark **?** contains any value defined outside the query.<br>Value in **?** contains value listed in **variables** Array argument when calling `query(myquery, targetobject, `**variables**`)` function in order they appear in the query code.<br><br>For example, the first question mark will contain **"my value"** string if function is executed like this `query("data.?", target, [`**"my value"**`, 1])`
Mixed | **`@`** | myReference *from* data[1];<br>value *from* **@myReference**.value;<br><br>**@myReference**.name as name,<br>1 + **@value** as value | Uses the value referenced from **from** declaration.


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
Boolean | **`=`** | 1 **`=`** 2 | Modulo Division.
Boolean | **`>`** | 1 **`>`** 2 | Addition.
Boolean | **`>=`** | 1 **`>=`** 2 | Subtraction.
Boolean | **`<`** | 1 **`<`** 2 | Multiplication.
Boolean | **`<=`** | 1 **`<=`** 2 | Division.

### Assignment

Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`is`** | data[0] **`is`** "value" | Assigns **"value"** to **data[0]** expression.

### Object Query

Result Type | Operator | Example | Description
--- | --- | --- | ---
Mixed | **`.`** | data **`.`** propertyName<br>data **`.`** "propertyName" **`.`** target = ? | **Extract mode:**<br>Retrieves property of Object.<br><br>**Assign mode:**<br>Assign/Populate property value of the Object.
Mixed | **`[]`** | data **`[1]`**<br><br>data **`[propertyName]`** = ?<br><br>data **`[1..10, 20]`**<br><br>data **`[]`** is ? | **Extract mode:**<br>Retrieves property of an object or item of an Array list if there is only one value or identifier inside **`[]`**.<br><br>It can also act as object property or list index filter if **`[]`** contains none (e.g. **`[]`**), or two or more values (e.g. **`[1, 5, name]`**), or number range (e.g. **`[10..25]`**).<br>The result of list index or object property filter with **`[]`** operator end up as list array.<br><br>**Assign mode:**<br>Assign/populate list item or object property value. May also do multiple assignment of values when **`[]`** operator results in object property or list index filter.
Mixed | **`as`** | data[0] **as** propertyName |  