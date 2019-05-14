/**
 * This file gathers some reused validation rules using the indicative validation api.
 * see doc: https://indicative.adonisjs.com/
 */

const MIN_PASSWORD_LENGTH = 8;
const REQUIRED = fieldName => `${fieldName} is required.`;

export const PASSWORD = {
  messages: {
    'password.confirmed': 'Passwords do not match.',
    'password.required': REQUIRED('Password'),
    'password.min': `A minimun of ${MIN_PASSWORD_LENGTH} characters is required`
  },
  rule: `required|min:${MIN_PASSWORD_LENGTH}|confirmed`
};
export const required = fieldName => {
  return {
    rule: { [`${fieldName.toLowerCase()}`]: 'required' },
    message: { [`${fieldName.toLowerCase()}.required`]: REQUIRED(fieldName) }
  };
};

export const EMAIL = {
  messages: {
    'email.required': REQUIRED('Email'),
    'email.email': 'Please provide a valid email.'
  },
  rule: 'required|email'
};

export const NON_NEGATIVE = {
  message: 'The value cannot be negative',
  rule: 'above:-1'
};

export const validateFile = file => {
  // TODO
};
