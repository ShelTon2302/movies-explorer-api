const userRouter = require('express').Router(); // создали роутер
const { celebrate, Joi } = require('celebrate');
const {
  currentUser, updateUser, logout,
} = require('../controllers/user');
// const { urlRule } = require('../const/const');

userRouter.get('/users/me', currentUser);

userRouter.patch('/users/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

userRouter.post('/signout', logout);

module.exports = userRouter; // экспортировали роутер
