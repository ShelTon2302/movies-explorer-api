const appRouter = require('express').Router(); // создали роутер
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found-error');
const { msgNotFound } = require('../const/const');

appRouter.use(require('./auth'));

appRouter.use(auth);

appRouter.use(require('./user'));

appRouter.use(require('./movie'));

appRouter.use('/', (req, res, next) => {
  next(new NotFoundError(msgNotFound));
});

module.exports = appRouter; // экспортировали роутер
