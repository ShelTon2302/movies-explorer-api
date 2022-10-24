const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
require('dotenv').config();
const { createUser, login, logout } = require('./controllers/user');
const userRouter = require('./routes/user');
const movieRouter = require('./routes/movie');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const NotFoundError = require('./errors/not-found-error');
const { limiter } = require('./middlewares/limiter');

const { NODE_ENV, DB_LINK } = process.env;

//  Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//  Подключаем базу MongoDB
mongoose.connect(NODE_ENV === 'production' ? DB_LINK : 'mongodb://localhost:27017/moviesdb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter); // подключаем ограничитель количества запросов с одного адресв

app.use(helmet()); // добавление заголовков безопасности

// app.use(cors);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.use(auth);

app.post('/signout', logout);

app.use('/', userRouter, (req, res, next) => {
  next();
});

app.use('/', movieRouter, (req, res, next) => {
  next();
});

app.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT);
