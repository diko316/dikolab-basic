import { access } from "./path";
import { keys } from "./keys";

import { filterTruthy } from "./filter-truthy";
import { filterFalsy } from "./filter-falsy";

import { filterIs } from "./filter-is";
import { filterAmong } from "./filter-among";
import { filterIn } from "./filter-in";
import { filterLike } from "./filter-like";
import { filterBetween } from "./filter-between";

import { filterNot } from "./filter-not";
import { filterOutside } from "./filter-outside";
import { filterOut } from "./filter-out";
import { filterUnlike } from "./filter-unlike";

// built-in filters
// "subject.data[] | ~ country[].value truthy";
// "subject.data[] | ~ country[].value falsy";

// positive
// "subject.data[] | ~ country[].value is: 'US'";
// "subject.data[] | ~ country[].value among: 'CH', 'AL'";
// "subject.data[] | ~ country[].value in: ['CH', 'AL']";
// "subject.data[] | ~ country[].value like: /ab[a-z0-24]+a/";
// "subject.data[] | ~ country[].value between: 1, 10";

// negative
// "subject.data[] | ~ country[].value not: 'US'";
// "subject.data[] | ~ country[].value outside: 'CH', 'AL'";
// "subject.data[] | ~ country[].value out: ['CH', 'AL']";
// "subject.data[] | ~ country[].value unlike: /ab[a-z0-24]+a/";

export default {
  access,
  keys,

  truthy: filterTruthy,
  falsy: filterFalsy,

  is: filterIs,
  in: filterIn,
  among: filterAmong,
  like: filterLike,
  between: filterBetween,

  not: filterNot,
  outside: filterOutside,
  out: filterOut,
  unlike: filterUnlike
};
