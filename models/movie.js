const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Необходимо заполнить страну создания фильма'],
    minlength: 2,
  },
  director: {
    type: String,
    required: [true, 'Необходимо заполнить режиссера фильма'],
    minlength: 2,
  },
  duration: {
    type: Number,
    required: [true, 'Необходимо заполнить длительность фильма'],
  },
  year: {
    type: Number,
    required: [true, 'Необходимо заполнить год выпуска фильма'],
  },
  description: {
    type: String,
    required: [true, 'Необходимо заполнить описание фильма'],
    minlength: 2,
  },
  image: {
    type: String,
    required: [true, 'Необходимо заполнить ссылку на постер к фильму'],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }),
      message: 'Введите корректную ссылку',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Необходимо заполнить ссылку на трейлер фильма'],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }),
      message: 'Введите корректную ссылку',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Необходимо заполнить ссылку на миниатюрное изображение постера к фильму'],
    validate: {
      validator: (value) => validator.isURL(value, { protocols: ['http', 'https'] }),
      message: 'Введите корректную ссылку',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'Необходимо заполнить название фильма на русском языке'],
    minlength: 2,
  },
  nameEN: {
    type: String,
    required: [true, 'Необходимо заполнить название фильма на английском языке'],
    minlength: 2,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('movie', movieSchema);
