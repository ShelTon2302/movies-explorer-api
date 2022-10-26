const { msgAnotherErr } = require('../const/const');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500 ? msgAnotherErr : message,
    });
  next();
};
