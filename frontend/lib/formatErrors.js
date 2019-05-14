/**
 * Transforms an array of errors into an object of errors.
 * @param {array} errs An array of indicative validation errors
 * @returns {object} An object
 */
export default errs => {
  const obj = {};
  if (!Array.isArray(errs)) return obj;
  errs.forEach(err => {
    obj[err.field] = err.message;
  });
  return obj;
};
