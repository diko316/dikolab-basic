import { method } from "../native";

const DESTRUCTORS = [];
let INITIALIZED = false;
let DESTROYED = false;

function onDestroy() {
  let list = null;

  if (!DESTROYED) {
    list = DESTRUCTORS.slice(0);
    DESTROYED = true;

    for (let c = 0, length = list.length; length--; c++) {
      try {
        list[c]();
      }
      catch (error) {
        console.warn(error);
      }
    }

    DESTRUCTORS.length = list.length = 0;
  }
}

function onBrowserDestroy() {
  window.removeEventListener("beforeunload", onDestroy);
  window.removeEventListener("unload", onDestroy);
}

function onProcessDestroy() {
  process.removeListener("beforeExit", onDestroy);
}

function initialize() {
  const list = DESTRUCTORS;

  if (!INITIALIZED) {
    INITIALIZED = true;

    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", onDestroy, false);
      window.addEventListener("unload", onDestroy, false);
      list[list.length] = onBrowserDestroy;
    }

    if (typeof process !== "undefined") {
      process.on("beforeExit", onDestroy);
      list[list.length] = onProcessDestroy;
    }
  }
}

export function destructor(callback) {
  const list = DESTRUCTORS;

  if (method(callback)) {
    initialize();
    list[list.length] = callback;
  }
}
