/** Somebody's name */
export type Name = string;
/**
 * Say something to somebody
 *
 * @param phrase - Hello or Goodbye
 * @param name - Name of the person to greet
 */
export default function saySomething(phrase: 'Hello' | 'Goodbye', name: Name): void;
