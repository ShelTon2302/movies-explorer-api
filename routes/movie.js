const { celebrate } = require('celebrate');
const movieRouter = require('express').Router(); // создали роутер
const { saveMovieValid, deleteMovieValid } = require('../const/valid');
const {
  moviesCurrentUser, saveMovie, deleteMovie,
} = require('../controllers/movie');

movieRouter.get('/movies', moviesCurrentUser);

movieRouter.post('/movies', celebrate(saveMovieValid), saveMovie);

movieRouter.delete('/movies/:id', celebrate(deleteMovieValid), deleteMovie);

module.exports = movieRouter; // экспортировали роутер
