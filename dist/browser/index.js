/** typescript-library-starter @version 1.0.0 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.saySomething = factory());
})(this, (function () { 'use strict';

    /**
     * Say hello to someone
     *
     * @param name - Who would you like to say hello to?
     */
    function sayHello(name) {
        console.log("Hello ".concat(name));
    }

    /**
     * Say goodbye to someone
     *
     * @param name - Who would you like to say goodbye to?
     */
    function sayGoodbye(name) {
        console.log("Goodbye ".concat(name));
    }

    /**
     * Say something to somebody
     *
     * @param phrase - Hello or Goodbye
     * @param name - Name of the person to greet
     */
    function saySomething(phrase, name) {
        if (phrase === 'Hello') {
            sayHello(name);
        }
        else {
            sayGoodbye(name);
        }
    }

    return saySomething;

}));
//# sourceMappingURL=index.js.map
