const Movie = require('../models/movie');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  Movie.create({ owner, ...req.body })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Некорректные данные при создании фильма.'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie
    .findById(req.params.movieId)
    .orFail(() => {
      throw new NotFound('Фильм с указанным id не найден.');
    })
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Нет прав для удаления фильма с указанным id.');
      }
      Movie
        .findByIdAndRemove(req.params.movieId)
        .then(() => {
          res.send({ message: 'Фильм успешно удален.' });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
