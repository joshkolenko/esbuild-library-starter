import { validate } from './lib/validate.js';
import { loadRecaptcha } from './lib/load-recaptcha.js';
import { getRecaptchaToken } from './lib/get-recaptcha-token.js';
import { handleErrors } from './lib/handle-errors.js';
import { parseError } from './lib/parse-error.js';
import { formatFieldData } from './lib/format-field-data.js';

import type {
  _FieldError,
  _SFMCValue,
  _UnparsedError,
  Events,
  Field,
  FieldErrorMessages,
  Form,
  Options,
  Settings,
} from './lib/types.js';

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
export function createForm(
  element: HTMLElement | string,
  options: Options
): Form {
  if (typeof element === 'string') {
    element = document.querySelector(element) as HTMLElement;
  }

  const defaults = {
    brand: 'WWW',
    dataExtension: 'FED_Testing',
    errors: true,
    errorEl: element,
    errorClass: 'form-error',
    errorFieldClass: 'error',
    errorPosition: 'top',
    errorListClass: 'form-errors',
    method: 'WISDM',
    recaptcha: false,
  };

  const settings: Settings = Object.assign(defaults, options);

  if (!element) {
    throw new Error('Could not find element');
  }

  if (!element.dataset.name) {
    throw new Error('Form element must have data-name attribute');
  }

  if (settings.method === 'SFMC' && !settings.dataExtension) {
    throw new Error('SFMC method requires dataExtension');
  }

  if (settings.method === 'SFMC' && !settings.brand) {
    throw new Error('SFMC method requires brand');
  }

  const form = {
    element,
    name: element.dataset.name.replace(/[ \-\_]/g, ''),
  };

  const events: Events = {
    submit() {},
    success() {},
    error() {},
  };

  if (settings.method === 'WISDM' || settings.recaptcha) {
    loadRecaptcha(form);
  }

  const fields = Array.from(
    form.element.querySelectorAll('[data-field]')
  ) as Field[];

  if (!fields.length) {
    throw new Error('No fields found');
  }

  async function submit() {
    try {
      events.submit();

      const errorList = (settings.errorEl || form.element).querySelector(
        '.' + settings.errorListClass
      );

      if (errorList) {
        errorList.remove();
      }

      const errorMessages = (settings.errorEl || form.element).querySelectorAll(
        '.' + settings.errorClass
      );

      if (errorMessages.length) {
        errorMessages.forEach(error => error.remove());
      }

      const errors: _UnparsedError[] = fields
        .map((field): _UnparsedError | undefined => {
          field.classList.remove(settings.errorFieldClass);

          const result = validate(field);

          const fieldName = field.dataset.field;

          let messages: FieldErrorMessages = {
              invalid: `${fieldName} is invalid`,
              empty: `${fieldName} is empty`,
            },
            handleError;

          field.classList.add(settings.errorFieldClass);

          if (settings.errors && Array.isArray(settings.errors)) {
            const customError = settings.errors.find(customErrorObj => {
              return customErrorObj.field === field.dataset.field;
            });

            if (customError) {
              messages = { ...messages, ...customError.messages };
              handleError = customError.handleError;
            }
          }

          if (result === 'empty') {
            return {
              field,
              errorCode: 1,
              errorMessage: messages.empty,
              handleError,
            };
          }

          if (result === 'invalid') {
            return {
              field,
              errorCode: 2,
              errorMessage: messages.invalid,
              handleError,
            };
          }
        })
        .filter(error => error !== undefined) as _UnparsedError[];

      if (errors.length) {
        throw errors;
      }

      if (settings.method === 'WISDM') {
        const url = emailPreferencesURL;

        const emailField = fields.find(field => field.type == 'email');

        if (!emailField || !emailField.value) {
          const error: _UnparsedError = {
            errorCode: 4,
            errorMessage: 'Email field required when method = WISDM',
          };

          throw error;
        }

        const email = emailField.value;

        const token = await getRecaptchaToken(form.name);

        const data = new FormData();
        data.append('OptStatus', 'I');
        data.append('EmailAddress', email);
        data.append('g-recaptcha-response', token);

        const response = await fetch(url, {
          method: 'POST',
          body: data,
        });

        events.success(response);
      }

      if (settings.method === 'SFMC') {
        const urls: { [key: string]: string } = {
          WWW: 'https://cloud.email.wwwincnews.com/form',
          BTS: 'https://cloud.email.batesfootwear.com/form',
          CAT: 'https://cloud.email.catfootwear.com/form',
          CHA: 'https://cloud.email.chacos.com/form',
          HDF: 'https://cloud.email.harley-davidsonfootwear.com/form',
          HUS: 'https://cloud.email.hushpuppies.com/form',
          HYT: 'https://cloud.email.hytest.com/form',
          KED: 'https://cloud.email.keds.com/form',
          MER: 'https://cloud.email.merrell.com/form',
          PRO: 'https://cloud.email.prokeds.com/form',
          SAU: 'https://cloud.email.saucony.com/form',
          SPE: 'https://cloud.email.sperry.com/form',
          WOL: 'https://cloud.email.wolverine.com/form',
        };

        const url = urls[settings.brand];

        const properties: _SFMCValue[] = fields
          .map(field => formatFieldData(field))
          .concat(settings.values || [])
          .map(item => {
            return {
              Name: item.name,
              Value: item.value,
            };
          });

        let token: string;

        if (settings.recaptcha) {
          token = await getRecaptchaToken(form.name);
          properties.push({ Name: 'RecaptchaToken', Value: token });
        }

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dataExtension: settings.dataExtension,
            properties,
          }),
        });

        const data = await response.json();

        if (data.status === 'Error') {
          throw [
            {
              errorCode: data.errorCode,
              errorMessage: data.errorMessage,
            },
          ];
        }

        events.success(response);
      }

      if (settings.redirect) {
        window.location.href = settings.redirect;
      }
    } catch (errors) {
      if (errors !== null && Array.isArray(errors)) {
        const element = settings.errorEl || form.element;
        const parsedErrors = (errors as _UnparsedError[]).map(error =>
          parseError(error)
        );

        if (settings.errors) {
          handleErrors(element, parsedErrors, settings);
        }

        events.error(parsedErrors);
      } else {
        const parsedError = parseError(errors as _UnparsedError);
        events.error([parsedError]);
      }
    }
  }

  fields.forEach(field => {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement
    )
      field.addEventListener('keyup', event => {
        const { key } = event as KeyboardEvent;

        if (key === 'Enter') {
          event.preventDefault();
          submit();
        }
      });
  });

  const button = form.element.querySelector('button[type=submit]');

  if (button) {
    button.addEventListener('click', submit);
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
