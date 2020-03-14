const OBJECT = Object;

const ObjectPrototype = OBJECT.prototype;

export const OBJECT_DEFINE_PROPERTY = OBJECT.defineProperty;

export const OBJECT_TO_STRING = ObjectPrototype.toString;

export const OBJECT_HAS_OWN = ObjectPrototype.hasOwnProperty;

export const OBJECT_KEYS = OBJECT.keys;
