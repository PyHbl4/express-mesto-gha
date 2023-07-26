const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthError = require('../errors/auth-error');
const ServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10, (error, hashedPassword) => {
    if (error) {
      next(new ServerError('Произошла ошибка на стороне сервера'));
      return;
    }

    User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    })
      .then((user) => res.send({
        data: {
          name: user.name,
          about: user.about,
          email: user.email,
          avatar: user.avatar,
        },
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new BadRequestError('Произошла ошибка, неверный запрос'));
        } else if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже есть в базе'));
        } else {
          next(err);
        }
      });
  });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(new AuthError(err.message));
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new ServerError('Произошла ошибка на стороне сервера')));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка, неверный запрос'));
      } else {
        next(new ServerError('Произошла ошибка на стороне сервера'));
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Произошла ошибка, неверный запрос'));
      } else {
        next(new ServerError('Произошла ошибка на стороне сервера'));
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};

module.exports.updateInfo = (req, res, next) => {
  const update = {};

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.about) {
    update.about = req.body.about;
  }

  User.findOneAndUpdate(
    { _id: req.user._id },
    update,
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(new ServerError(err.message));
      }
    });
};
