import type { _UnparsedError, ParsedError } from './types';

export function parseError(error: _UnparsedError): ParsedError {
  if (error.errorMessage) {
    if (error.errorMessage.includes('Violation of PRIMARY KEY')) {
      error.errorCode = 3;
      error.errorMessage = 'Email address already exists';
    }

    if (error.errorMessage.includes('Cannot insert the value')) {
      const match = error.errorMessage.match(/column '(.+?)'/);

      if (match) {
        const name = match[1];
        error.errorCode = 4;
        error.errorMessage = `Please provide a value for ${name}`;
      }
    }

    if (error.errorMessage.includes('CustomerKey')) {
      error.errorCode = 5;
      error.errorMessage = `Invalid data extension`;
    }
  }

  return {
    field: error.field,
    code: error.errorCode,
    message: error.errorMessage,
    handleError: error.handleError,
  };
}
