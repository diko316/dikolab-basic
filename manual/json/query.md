# JSON Query

## Getting Started

## `get` query

### extract value

#### data.json
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

### Simple extract value 
```js
const object = require("data.json");

// returns 1
query(
  object,
  "get data[0].id"
);
```

### Compose Object
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

### List Filter
```js
// returns [ "en", "fr" ]
query(
  object,
  "get data[] #name=name1 language[]"
);
```

### Substitution
```js
// returns [ "en", "fr" ]
query(
  object,
  "get data[] #name=? language[]",
  [
    "name1"
  ]
);
```

## `set` query

### assign value

#### data.json
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

### Simple set
```js
// data[0] will now contain { id: 42, name: "name1", language: ["en", "fr"]}
query(
  object,
  "set data[0].id=42"
);
```