export default errs => {
  const obj = {};
  errs.forEach(err => {
    obj[err.field] = err.message;
  });
  return obj;
};
