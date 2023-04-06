import { sayHello } from './lib/say-hello.js';
import { sayGoodbye } from './lib/say-goodbye.js';

/** Somebody's name */
export type Name = string;

const name: Name = 'World';

/**
 * Say something to somebody
 *
 * @param phrase - Hello or Goodbye
 * @param name - Name of the person to greet
 */
export function saySomething(phrase: 'Hello' | 'Goodbye', name: Name) {
  if (phrase === 'Hello') {
    sayHello(name);
  } else {
    sayGoodbye(name);
  }
}
