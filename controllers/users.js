const User = require('../models/user');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err }));
};
module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err }));
};
module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true },
  )
    .then((user) => res.send(`Аватар пользователя "${user.name}" обновлён успешно`))
    .catch((err) => res.status(500).send({ message: err }));
};

module.exports.updateInfo = (req, res) => {
  const update = {};

  if (req.body.name) {
    update.name = req.body.name;
  }

  if (req.body.about) {
    update.about = req.body.about;
  }
  User.findByIdAndUpdate(
    req.user._id,
    update,
    { new: true },
  )
    .then((user) => res.send(`Данные пользователя "${user.name}" обновлены успешно`))
    .catch((err) => res.status(500).send({ message: err }));
};
