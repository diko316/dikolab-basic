import { TYPE_FUNCTION } from "../native/constants";

const DESTRUCTORS = [];
let INITIALIZED = false;
let DESTROYED = false;

/**
 * @private
 */
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

/**
 * @private
 */
function onBrowserDestroy() {
  window.removeEventListener("beforeunload", onDestroy);
  window.removeEventListener("unload", onDestroy);
}

/**
 * @private
 */
function onProcessDestroy() {
  process.removeListener("beforeExit", onDestroy);
}

/**
 * @private
 */
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

/**
 * Registers a destructor handler. Very useful for NodeJS and browser.
 *
 * @param {Function} callback Function to call when app shutsdown or browser document is unloaded.
 */
export function destructor(callback) {
  const list = DESTRUCTORS;

  if (typeof callback === TYPE_FUNCTION) {
    initialize();
    list[list.length] = callback;
  }
}
