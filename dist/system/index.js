System.register([], function (exports) {
  'use strict';
  return {
    execute: function () {

      exports('isObject', isObject);

      var TO_STRING = Object.prototype.toString;
      function isObject(subject) {
        return TO_STRING.call(subject) === '[object Object]';
      }

    }
  };
});
