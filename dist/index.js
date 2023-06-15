/** typescript-library-starter @version 1.0.0 */

import { sayHello } from './lib/say-hello.js';
import { sayGoodbye } from './lib/say-goodbye.js';

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

export { saySomething as default };
