const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-error');
const ServerError = require('../errors/internal-server-error');
const NotFoundError = require('../errors/not-found-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Произошла ошибка, неверный запрос'));
      } else {
        next(new ServerError('Произошла ошибка на стороне сервера'));
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new ServerError('Произошла ошибка на стороне сервера')));
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === userId.toString()) {
          Card.findByIdAndRemove(cardId)
            .then(() => {
              res.send({ data: card });
            });
        } else {
          next(new ForbiddenError('нельзя удалить карточку, которую Вы не создавали'));
        }
      } else {
        next(new NotFoundError('Карточка не найдена'));
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

module.exports.addLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка не найдена'));
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

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        next(new NotFoundError('Карточка не найдена'));
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
