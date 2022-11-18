const authRouter = require('express').Router(); // создали роутер
const { celebrate } = require('celebrate');
const { signupValid, signinValid } = require('../const/valid');
const { createUser, login } = require('../controllers/user');

authRouter.post('/signup', celebrate(signupValid), createUser);

authRouter.post('/signin', celebrate(signinValid), login);

module.exports = authRouter; // экспортировали роутер
