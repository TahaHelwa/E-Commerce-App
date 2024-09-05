const reqKeys = ["body", "params", "Query", "headers"];

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    const validationErrors = [];
    for (const key of reqKeys) {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        // validationResult return value OR value,error
        if (validationResult?.error)
          validationErrors.push(validationResult.error.details);
      }
    }
    validationErrors.length ? res.status(400).json(validationErrors) : next();
  };
};
export { validateMiddleware };
