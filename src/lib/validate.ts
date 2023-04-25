import isEmpty from 'validator/es/lib/isEmpty';
import isEmail from 'validator/es/lib/isEmail';
import isMobilePhone, {
  MobilePhoneLocale,
} from 'validator/es/lib/isMobilePhone';

import type { Field, _FieldError } from './types';

export function validate(field: Field): _FieldError {
  if (field instanceof HTMLDivElement) {
    const radios = Array.from(
      field.querySelectorAll('input[type=radio]')
    ) as HTMLInputElement[];

    const hasRequired = !!radios.filter(radio => radio.required)[0];
    const hasChecked = !!radios.filter(radio => radio.checked)[0];

    if (hasRequired && !hasChecked) {
      return 'invalid';
    }
  } else {
    const type = field.type;
    const isRequired = field.required;

    if (type === 'checkbox' && field instanceof HTMLInputElement) {
      if (isRequired && !field.checked) {
        return 'invalid';
      }
    } else {
      const value = field.value || '';

      if (isEmpty(value)) {
        if (isRequired) {
          return 'empty';
        }
      } else {
        if (type === 'email') {
          if (!isEmail(value)) {
            return 'invalid';
          }
        }

        if (type === 'tel') {
          const locale: MobilePhoneLocale =
            (field.dataset.locale as MobilePhoneLocale) || 'any';

          if (!isMobilePhone(value, locale)) {
            return 'invalid';
          }
        }
      }
    }
  }

  return 'valid';
}
