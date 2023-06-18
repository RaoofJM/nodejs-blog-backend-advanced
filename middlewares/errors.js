exports.errorHandler = (error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message, data });
};

exports.createError = (statusCode, data, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.data = data;

  return error;
};
