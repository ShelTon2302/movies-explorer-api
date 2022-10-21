const { celebrate, Joi } = require('celebrate');
const movieRouter = require('express').Router(); // создали роутер
const { urlRule } = require('../const/const');
const {
  moviesCurrentUser, saveMovie, deleteMovie,
} = require('../controllers/movie');

movieRouter.get('/movies', moviesCurrentUser);

movieRouter.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2),
    director: Joi.string().required().min(2),
    duration: Joi.string().required().min(2),
    year: Joi.number().required(),
    description: Joi.string().required().min(2),
    image: Joi.string().required().regex(urlRule),
    trailerLink: Joi.string().required().regex(urlRule),
    thumbnail: Joi.string().required().regex(urlRule),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required().min(2),
    nameEN: Joi.string().required().min(2),
  }),
}), saveMovie);

movieRouter.delete('/movies/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter; // экспортировали роутер
