import type { Field, ParsedError, Settings } from './types';

export function handleErrors(
  element: HTMLElement,
  errors: ParsedError[],
  settings: Settings
): void {
  if (
    settings.errorPosition === 'before' ||
    settings.errorPosition === 'after'
  ) {
    errors.forEach(error => {
      const field = error.field as Field;

      if (field) {
        const errorEl = document.createElement('div');
        errorEl.role = 'alert';
        errorEl.classList.add(settings.errorClass);
        errorEl.innerHTML = error.message;

        if (error.handleError) {
          error.handleError(field, error.message, errorEl);
        } else if (settings.errorPosition === 'before') {
          field.before(errorEl);
        } else {
          field.after(errorEl);
        }
      }
    });
  } else {
    const errorList = document.createElement('ul');
    errorList.role = 'alert';
    errorList.classList.add(settings.errorListClass);

    const errorListItems = errors.map(error => {
      const errorListItem = document.createElement('li');
      errorListItem.classList.add(settings.errorClass);
      errorListItem.innerHTML = error.message;

      return errorListItem;
    });

    errorListItems.forEach(errorListItem => errorList.append(errorListItem));

    if (settings.errorPosition === 'top') {
      element.prepend(errorList);
    } else if (settings.errorPosition === 'bottom') {
      element.append(errorList);
    }
  }
}
