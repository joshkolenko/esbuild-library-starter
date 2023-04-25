declare global {
  /**
   * The URL to the email preferences page.
   * Must be added in `emergency-content` as a global variable.
   */
  var emailPreferencesURL: string;

  interface Window {
    app: {
      recaptcha: {
        widgetId?: number;
        token?: string;
        [key: string]: string | number | undefined;
      };
    };
  }
}

/**
 * Options object used to configure __createForm__.
 * @public
 */
export interface Options {
  /**
   * Brand abbreviation for `method: SFMC`.
   */
  brand?: Brand;
  /**
   * SFMC data extension external key. Required if method is `'SFMC'`.
   */
  dataExtension?: string;
  /**
   * Boolean or array of custom error objects used to override default
   * error messaging. Defaults to `true`.
   *
   * @example
   * Set to `false` to disable error messaging.
   *
   * __Custom error messaging:__
   * ```javascript
   * {
   *   field: 'EmailAddress',
   *   messages: {
   *     empty: 'Email address is required',
   *     invalid: 'Email address is invalid',
   *   },
   * }
   * ```
   */
  errors?: boolean | CustomError[];
  /**
   * Class name to add to the error element. Defaults to `'form-error'`.
   */
  errorClass?: string;
  /**
   * Element to append/prepend error messages to. Defaults to the form element.
   */
  errorEl?: HTMLElement;
  /**
   * Class name to add to the field element when an error occurs. Defaults to `'error'`.
   */
  errorFieldClass?: string;
  /**
   * Class name to add to the error `ul` element when errorPosition is set to `top`
   * or `bottom`. Defaults to `'form-errors'`.
   */
  errorListClass: string;
  /**
   * Where elements should be displayed.
   * - `top`: Prepended to `errorEl` or form element.
   * - `bottom`: Appended to `errorEl` or form element.
   * - `before`: Before the field element where error occurred.
   * - `after`: After the field element where error occurred.
   *
   * Note: `before` & `after` add support for using a `handleError` function on
   * custom errors. Useful for if you'd like to intercept where the error is
   * displayed.
   *
   * @example
   * ```javascript
   * {
   *   field: 'Checkbox',
   *   messages: {
   *    invalid: 'Checkbox is invalid',
   *   },
   *   handleError(field, error, errorEl) {
   *     field.closest('div').append(errorEl);
   *   },
   * }
   * ```
   */
  errorPosition?: 'top' | 'bottom' | 'before' | 'after';
  /**
   * __Required__
   *
   * Method to use for form submission.
   * - `SFMC`: Custom signups
   * - `WISDM`: Welcome signup
   */
  method: 'SFMC' | 'WISDM';
  /**
   * Boolean to enable reCAPTCHA for `method: SFMC`. Always `true` for `method: WISDM`.
   */
  recaptcha?: boolean;
  /**
   * URL to redirect to after successful form submission.
   */
  redirect?: string;
  /**
   * Array of extra values to submit to `SFMC` data extension.
   *
   * @example
   * ```javascript
   * [
   *  { name: 'Language', value: 'en' },
   *  { name: 'EventName', value: 'event-name' }
   * ]
   * ```
   */
  values?: Value[];
}

/**
 * Full settings object after merging `Options` with defaults.
 * @public
 */
export interface Settings {
  brand: string;
  dataExtension: string;
  errors: boolean;
  errorEl: HTMLElement;
  errorClass: string;
  errorFieldClass: string;
  errorPosition: string;
  errorListClass: string;
  recaptcha: boolean;
  redirect?: string;
  method: string;
  values?: Value[];
}

/**
 * Field element with custom properties.
 * @public
 */
export type Field = HTMLElement & {
  checked: boolean;
  dataset: {
    field: string;
  };
  required: boolean;
  type: string;
  value: string | undefined;
};

/**
 * Value object used to submit extra data to `SFMC` data extension.
 * @public
 */
export interface Value {
  name: string;
  value: string | number | boolean;
}

/**
 * Correctly formatted object used to submit data to `SFMC` data extension.
 * @internal
 */
export interface _SFMCValue {
  Name: string;
  Value: string | number | boolean;
}

/**
 * Custom error object used to override default error messaging.
 * @public
 */
export interface CustomError {
  /**
   * Field to match against.
   *
   * @example
   * If trying to match this field:
   * ```html
   * <input type="email" name="Email" data-field="EmailAddress" />
   * ```
   *
   * The field name will be:
   * ```javascript
   * {
   *  //...
   *  field: 'EmailAddress'
   * }
   * ```
   */
  field: string;
  /**
   * Error messages to display for `invalid` and `empty` errors.
   */
  messages: FieldErrorMessages;
  /**
   *  ## handleError
   * Function to handle where error is displayed.
   *
   * @param field - Field element where error occurred.
   * @param error - Error message.
   * @param errorEl - Error element to display.
   */
  handleError?(field: Field, error: string, errorEl: HTMLElement): void;
}

/**
 * Error messages to display for `invalid` and `empty` errors.
 * @public
 */
export interface FieldErrorMessages {
  /**
   * Error message to display when field is invalid.
   *
   * Note: Required checkboxes and radio buttons will display this message only.
   */
  invalid: string;
  /**
   * Error message to display when required field is empty.
   */
  empty: string;
}

/**
 * Error codes returned validate.ts.
 * @internal
 */
export type _FieldError = 'valid' | 'empty' | 'invalid';

/**
 * Error object returned when form submission fails.
 * @public
 */
export interface ParsedError {
  field?: Field;
  code: number;
  message: string;
  handleError?: CustomError['handleError'];
}

/** @internal */
export interface _UnparsedError {
  field?: Field;
  errorCode: number;
  errorMessage: string;
  handleError?: CustomError['handleError'];
}

/**
 * Brand codes used to set `brand` setting.
 * @public
 */
export type Brand =
  | 'WWW'
  | 'BTS'
  | 'CAT'
  | 'CHA'
  | 'HDF'
  | 'HUS'
  | 'HYT'
  | 'KED'
  | 'MER'
  | 'PRO'
  | 'SAU'
  | 'SPE'
  | 'WOL';

/**
 * Form object returned from `createForm()`
 *
 * Has methods to submit form and listen to form events.
 * @public
 * */
export interface Form {
  /**
   * Element where form is initialized.
   */
  el: HTMLElement;
  /**
   * Form settings.
   */
  settings: Settings;
  /**
   * Method to programatically submit form.
   */
  submit(): void;
  /**
   * Form events
   * Events that are triggered during the lifecycle of a form submission.
   *
   * - `submit`: Form is submitted.
   * - `success`: Form is successfully submitted. Receives response object as argument.
   * - `error`: Form submission failed. Receives `ParsedError[]` array as argument.
   *
   * @param event - `submit`, `success`, or `error`
   * @param handler - Function to run when event is triggered.
   */
  on<E extends keyof Events>(event: E, handler: Events[E]): void;
}

/**
 * Form events
 * @public
 */
export interface Events {
  submit(): void;
  success(data: {}): void;
  error(errors: ParsedError[]): void;
}
