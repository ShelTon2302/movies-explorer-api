const Movie = require('../models/movie');
const RequestError = require('../errors/request-error');
const AccessError = require('../errors/access-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.moviesCurrentUser = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ movies }))
    .catch(next);
};

module.exports.saveMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body; // получим из объекта запроса данные фильма

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  }) // создадим документ на основе пришедших данных
    // .populate(['owner'])
    .then((movie) => {
      res.send({ movie });
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        const deletedMovie = movie;
        movie.remove()
          .catch(next);
        res.send(deletedMovie);
      } else {
        next(new AccessError('Нарушение прав доступа'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new RequestError('Переданы некорректные данные'));
        return;
      }
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFoundError('Запрашиваемая карточка не найдена'));
        return;
      }
      next(err);
    });
};
