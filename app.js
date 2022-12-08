const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// const helmet = require('helmet');
const { errors } = require('celebrate');
require('dotenv').config();
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error');
const { limiter } = require('./middlewares/limiter');

const { NODE_ENV, DB_LINK } = process.env;
const { mongoLinkDev } = require('./const/conf');

//  Слушаем 3000 порт
const { PORT = 3010 } = process.env;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//  Подключаем базу MongoDB
mongoose.connect(NODE_ENV === 'production' ? DB_LINK : mongoLinkDev, {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(requestLogger); // подключаем логгер запросов

app.use(limiter); // подключаем ограничитель количества запросов с одного адресв

// app.use(helmet()); // добавление заголовков безопасности

app.use(cors);

app.use(require('./routes/index'));

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(errorHandler);

app.listen(PORT);
