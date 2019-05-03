export default errs => {
  const obj = {};
  if (!Array.isArray(errs)) return obj;
  errs.forEach(err => {
    obj[err.field] = err.message;
  });
  return obj;
};
