const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // импортируем bcrypt
const validator = require('validator');
const AuthError = require('../errors/auth-error');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: [true, 'Адрес email не уникален'],
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Введите корректный email',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      require: true,
    },
  },
  {
    toObject: {
      useProjection: true,
      versionKey: false,
    },
  },
);

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthError('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthError('Неправильные почта или пароль');
          }
          return user; // теперь user доступен
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);