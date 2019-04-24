/* eslint-disable no-useless-escape */
const MIN_LENGTH = 0;
const MAX_LENGTH = 500;

exports.checkEmail = value => {
  // https://stackoverflow.com/a/46181
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return value.length <= 254 && re.test(value);
};

exports.lengthIsLowerOrEqual = (value, maxLength = MAX_LENGTH) => {
  return value.length <= maxLength;
};

exports.lengthIsGreaterOrEqual = (value, minLength = MIN_LENGTH) => {
  return value.length >= minLength;
};
