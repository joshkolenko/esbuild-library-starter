import { createForm } from 'form-handler';

const form = createForm('#form', {
  method: 'SFMC',
  brand: 'WWW',
  dataExtension: 'FED_Testing',
  errors: [
    {
      field: 'FirstName',
      messages: {
        empty: 'Please enter your first name'
      }
    },
    {
      field: 'LastName',
      messages: {
        empty: 'Please enter your last name'
      }
    },
    {
      field: 'EmailAddress',
      messages: {
        empty: 'Empty email address',
        invalid: 'Invalid email address'
      }
    },
    {
      field: 'Phone',
      messages: {
        empty: 'Empty phone number',
        invalid: 'Invalid phone number'
      }
    },
    {
      field: 'Option',
      messages: {
        invalid: 'Please select an option'
      }
    },
    {
      field: 'MarketingOptIn',
      messages: {
        invalid: 'Opt in to marketing to continue'
      },
      handleError(field, error, errorEl) {
        field.closest('div').append(errorEl);
      }
    }
  ]
});

form.on('success', async (data) => {
  console.log('success', data);
});
