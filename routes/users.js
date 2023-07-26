const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateAvatar,
  updateInfo,
  getCurrentUser,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().required().hex(),
  }),
}), getUserById);
router.patch('/me', updateInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
