import type { Field, Value } from './types';

export function formatFieldData(field: Field): Value {
  const name = field.dataset.field;
  let value: string | number | boolean | undefined;

  if (field.tagName === 'DIV') {
    const radios = Array.from(
      field.querySelectorAll(
        'input[type=radio]'
      ) as NodeListOf<HTMLInputElement>
    );
    const checked = radios.filter(radio => radio.checked)[0];

    if (checked) {
      value = checked.value;
    }
  } else {
    const type = field.type;

    if (type === 'checkbox' && field instanceof HTMLInputElement) {
      value = field.checked;
    } else {
      value = field.value;
    }
  }

  if (value === undefined) {
    value = '';
  }

  return { name, value };
}
