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

const MAX_LENGTH = process.env.STRING_MAX_CHAR || 500;

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

const addressValidation = {
  rules: {
    'address.street': `required_with_any:address.city,address.country,address.zipCode|max:${MAX_LENGTH}`,
    'address.city': `required_with_any:address.street,address.country,address.zipCode|max:${MAX_LENGTH}`,
    'address.country': `required_with_any:address.street,address.city,address.zipCode|max:${MAX_LENGTH}`
  },
  messages: { required_with_any: requiredMessage, max: maxMessage }
};

const bankDetailsValidation = {
  rules: {
    'bankDetails.bic': `requiredIf:bankDetails.iban|max:${MAX_LENGTH}`,
    'bankDetails.iban': `requiredIf:bankDetails.bic|max:${MAX_LENGTH}` // TODO change to IBAN format
  },
  messages: { requiredIf: requiredMessage, max: maxMessage }
};

const companyValidation = {
  rules: {
    'company.name': `required|max:${MAX_LENGTH}`,
    'company.email': 'email',
    'company.phone': `max:${MAX_LENGTH}`, // TODO change to regex
    'company.VAT': `max:12`, // TODO change to regex ?
    ...addressValidation.rules,
    ...bankDetailsValidation.rules
  },
  messages: {
    required: requiredMessage,
    max: maxMessage,
    email: WRONG_EMAIL_FORMAT,
    ...bankDetailsValidation.messages,
    ...addressValidation.messages
  },
  formatData: data => ({
    ...data,
    email: data.email === null ? undefined : data.email,
    address: { ...data.address },
    bankDetails: { ...data.bankDetails }
  })
};

// module.exports = companyValidation;

// const categoryValidation = {
//   rules: {
//     name: `required|max:${MAX_LENGTH}`
//   },
//   messages: {
//     required: requiredMessage
//   }
// };

// module.exports = categoryValidation;

exports.registerValidation = {
  rules: {
    email: 'email|required',
    name: `required|max:${MAX_LENGTH}`,
    password: `required|min:8|max:1000`,
    ...addressValidation.rules,
    ...bankDetailsValidation.rules
  },
  messages: {
    required: requiredMessage,
    ...addressValidation.messages,
    ...bankDetailsValidation.messages,
    min: minMessage,
    max: maxMessage,
    email: WRONG_EMAIL_FORMAT
  },
  formatData: data => {
    return {
      email: data.email,
      name: data.name,
      password: data.password,
      bankDetails: { ...data.bankDetails },
      address: { ...data.address }
    };
  }
};

exports.updateProfileValidation = {
  rules: {
    email: 'email',
    name: `min:1|max:${MAX_LENGTH}`,
    password: `min:8|max:1000`,
    ...addressValidation.rules,
    ...bankDetailsValidation.rules
  },
  messages: {
    required: requiredMessage,
    min: minMessage,
    max: maxMessage,
    email: WRONG_EMAIL_FORMAT,
    ...addressValidation.messages,
    ...bankDetailsValidation.messages
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
    return { ...formattedData, bankDetails: { ...data.bankDetails }, address: { ...data.address } };
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

exports.uploadInvoiceValidation = {
  rules: {
    VAT: 'above:-1',
    amount: 'above:-1',
    date: 'date',
    expDate: 'date',
    ...companyValidation.rules,
    'company.name': `min:1|max:${MAX_LENGTH}`
  },
  messages: {
    above: aboveMessage,
    date: INVALID_DATE_FORMAT,
    min: minMessage,
    max: maxMessage,
    ...companyValidation.messages
  },
  formatData: data => ({ ...data, company: companyValidation.formatData({ ...data.company }) })
};

exports.generateInvoiceValidation = {
  rules: {
    'details.*.description': `required|max:${MAX_LENGTH}`,
    'details.*.amount': `above:-1|max:${MAX_LENGTH}`,
    VAT: 'above:-1',
    'company.name': `required|max:${MAX_LENGTH}`,
    'company.address.street': `required|max:${MAX_LENGTH}`,
    'company.address.city': `required|max:${MAX_LENGTH}`,
    'company.address.zipCode': `required`,
    'company.address.country': `required|max:${MAX_LENGTH}`
  },
  messages: {
    above: aboveMessage,
    max: maxMessage,
    required: requiredMessage
  },
  formatData: data => {
    data.details = data.details.map(detail => ({ ...detail }));
    return { ...data, details: [...data.details], company: data.company.toJSON() };
  }
};
