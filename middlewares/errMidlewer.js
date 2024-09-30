const sendErrorForDeveloper = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    msg: err.message,
    stack: err.stack,
  });
};
const globalError = (err, req, res, next) => {
  // Send error response as a with 400 status
  err.statusCode = err.statusCode || 500;
  // console.log(process.env.NODE_ENV);
  sendErrorForDeveloper(err, res);
};
module.exports = globalError;
