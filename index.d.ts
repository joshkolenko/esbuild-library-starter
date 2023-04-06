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

export { saySomething };
