const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateAvatar,
  updateInfo,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
