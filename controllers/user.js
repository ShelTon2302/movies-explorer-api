const bcrypt = require('bcryptjs'); // импортируем bcrypt
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const RequestError = require('../errors/request-error');
const AuthError = require('../errors/auth-error');
const NotUniqueEmailError = require('../errors/not-unique-email-error');

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
    })) // создадим документ на основе пришедших данных
    .then((user) => res.status(201).send(user.toObject()))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.code === 11000) {
        next(new NotUniqueEmailError('Пользователь с таким email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
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
        NODE_ENV === 'production' ? JWT_SECRET : '59c55acd63cac9349e3b2c538e86de0f',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send(user.toObject());
    })
    .catch(() => {
      throw new AuthError('Необходима авторизация');
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  User.findById(req.user._id)
    .then(() => res.clearCookie('jwt').send({ messge: 'Выход пользователя' }))
    .catch(next);
};

module.exports.currentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.send(user.toObject()))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
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
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      res.send(user.toObject());
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'CastError') {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
        return;
      }
      next(err);
    });
};