const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtSecretDev } = require('../const/conf');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const AuthError = require('../errors/auth-error');
const NotUniqueEmailError = require('../errors/not-unique-email-error');
const {
  msgNotUniqueUser, msgNoUser, msgReqErr, msgAuthErr, msgLogout,
} = require('../const/const');

module.exports.createUser = (req, res, next) => {
  const { NODE_ENV, JWT_SECRET } = process.env;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    })) // создадим документ на основе пришедших данных
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDev,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .status(201)
        .send(user.toObject());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new NotUniqueEmailError(msgNotUniqueUser));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new RequestError(msgReqErr));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : jwtSecretDev,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send(user.toObject());
    })
    .catch(() => {
      throw new AuthError(msgAuthErr);
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => res.clearCookie('jwt').send({ messge: msgLogout }))
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user.toObject()))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body; // получим из объекта запроса имя и описание пользователя

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError(msgNoUser));
        return;
      }
      res.send(user.toObject());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError(msgReqErr));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError(msgNoUser));
        return;
      }
      if (err.code === 11000) {
        next(new NotUniqueEmailError(msgNotUniqueUser));
        return;
      }
      next(err);
    });
};
