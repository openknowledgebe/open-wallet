/* eslint-disable no-useless-escape */
const { validateAll, configure } = require('indicative');
const { UserInputError } = require('apollo-server-express');
const {
  TOO_LONG,
  TOO_SHORT,
  REQUIRED,
  WRONG_EMAIL_FORMAT,
  MUST_BE_ABOVE,
  INVALID_DATE_FORMAT
} = require('../messages');

configure({
  EXISTY_STRICT: true
});

const MAX_LENGTH = 500;

exports.validate = (data, rules, messages) => {
  return new Promise((resolve, reject) => {
    validateAll(data, rules, messages)
      .then(() => resolve())
      .catch(errors => {
        const formattedErrors = errors.map(error => {
          return { [error.field]: error.message };
        });
        reject(new UserInputError(JSON.stringify(formattedErrors)));
      });
  });
};

const requiredMessage = field => {
  return REQUIRED(field);
};

const minMessage = (field, validation, args) => {
  if (args[0] === '1') return REQUIRED(field);
  return TOO_SHORT(field, args[0]);
};

const maxMessage = (field, validation, args) => TOO_LONG(field, args[0]);
const aboveMessage = (field, validation, args) => MUST_BE_ABOVE(field, args[0]);

exports.registerValidation = {
  rules: {
    email: 'email|required',
    name: `required|max:${MAX_LENGTH}`,
    password: `required|min:8|max:1000`,
    street: `required_with_any:city,country,zipCode|max:${MAX_LENGTH}`,
    city: `required_with_any:street,country,zipCode|max:${MAX_LENGTH}`,
    country: `required_with_any:street,city,zipCode|max:${MAX_LENGTH}`,
    bic: `requiredIf:iban|max:${MAX_LENGTH}`,
    iban: `requiredIf:bic|max:${MAX_LENGTH}` // TODO change to IBAN format
  },
  messages: {
    required: requiredMessage,
    requiredIf: requiredMessage,
    required_with_any: requiredMessage,
    min: minMessage,
    max: maxMessage,
    'email.email': WRONG_EMAIL_FORMAT
  },
  formatData: data => {
    return {
      email: data.email,
      name: data.name,
      password: data.password,
      ...data.address,
      ...data.bankDetails
    };
  }
};

exports.updateProfileValidation = {
  rules: {
    email: 'min:1|email',
    name: `min:1|max:${MAX_LENGTH}`,
    password: `min:8|max:1000`,
    street: `required_with_any:city,country,zipCode|max:${MAX_LENGTH}`,
    city: `required_with_any:street,country,zipCode|max:${MAX_LENGTH}`,
    country: `required_with_any:street,city,zipCode|max:${MAX_LENGTH}`,
    bic: `requiredIf:iban|max:${MAX_LENGTH}`,
    iban: `requiredIf:bic|max:${MAX_LENGTH}` // TODO change to IBAN format
  },
  messages: {
    required: requiredMessage,
    required_with_any: requiredMessage,
    requiredIf: requiredMessage,
    min: minMessage,
    max: maxMessage,
    'email.email': WRONG_EMAIL_FORMAT
  },
  formatData: data => {
    const formattedData = {};
    // Validation will give weird results without these checks
    if (data.email !== null) formattedData.email = data.email;
    else formattedData.email = '';
    if (data.name !== null) formattedData.name = data.name;
    else formattedData.name = '';
    if (data.password !== null) formattedData.password = data.password;
    else formattedData.password = '';

    return { ...formattedData, ...data.bankDetails, ...data.address };
  }
};

exports.expenseValidation = {
  rules: {
    VAT: 'above:-1',
    amount: 'above:-1',
    date: 'date',
    description: `required|max:${MAX_LENGTH}`
  },
  messages: {
    above: aboveMessage,
    date: INVALID_DATE_FORMAT,
    required: requiredMessage,
    max: maxMessage
  },
  formatData: data => {
    return { VAT: data.VAT, amount: data.amount, date: data.date, description: data.description };
  }
};
