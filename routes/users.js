const router = require('express').Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateAvatar,
  updateInfo,
} = require('../controllers/users');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateInfo);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
