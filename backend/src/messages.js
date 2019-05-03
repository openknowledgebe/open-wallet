// export constant messages
module.exports = {
  MUST_LOGIN: 'You must be logged in.',
  MUST_LOGOUT: 'You must be logged out.',
  WRONG_EMAIL_PASSWORD: 'Incorrect email or password. Please try again.',
  TOO_SHORT: (fieldName, minLength) =>
    `[${fieldName}] must have a minimum of ${minLength} characters.`,
  TOO_LONG: (fieldName, maxLength) =>
    `[${fieldName}] must have a maximum of ${maxLength} characters.`,
  REQUIRED: fieldName => `[${fieldName}] is required (cannot be empty)`,
  WRONG_EMAIL_FORMAT: 'Please provide a valid email address.',
  INVALID_DATE_FORMAT: 'Please provide a valid date format',
  MUST_BE_ABOVE: (fieldName, min) => `The value of [${fieldName}] should be above ${min}`
};
