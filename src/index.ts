import { validate } from './lib/validate.js';
import { loadRecaptcha } from './lib/load-recaptcha.js';
import { getRecaptchaToken } from './lib/get-recaptcha-token.js';
import { handleErrors } from './lib/handle-errors.js';
import { parseError } from './lib/parse-error.js';
import { formatFieldData } from './lib/format-field-data.js';

/** Somebody's name */
export type Name = string;

/**
 * __createForm__
 *
 * Creates a form object with methods for
 * submitting and validating & initializes
 * form on specified element
 *
 * @param element - HTMLElement or string selector
 * @param options - Options object for form configuration
 * @returns Form object
 *
 * @public
 */
export default function saySomething(phrase: 'Hello' | 'Goodbye', name: Name) {
  if (phrase === 'Hello') {
    sayHello(name);
  } else {
    sayGoodbye(name);
  }

  return {
    el: form.element,
    settings,
    submit,
    on(event, func): void {
      events[event] = func;
    },
  };
}
