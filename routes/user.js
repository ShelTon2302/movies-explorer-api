const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router(); // создали роутер
const {
  currentUser, updateUser,
} = require('../controllers/user');
// const { urlRule } = require('../const/const');

userRouter.get('/users/me', currentUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30),
  }),
}), updateUser);

module.exports = userRouter; // экспортировали роутер
