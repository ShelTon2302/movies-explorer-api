const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');
const { jwtDev } = require('../const/conf');
const { msgNeedAuth } = require('../const/const');

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!token) {
    next(new AuthError(msgNeedAuth));
    return;
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtDev);
  } catch (err) {
    next(new AuthError(msgNeedAuth));
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
