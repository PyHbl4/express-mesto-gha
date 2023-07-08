const router = require('express').Router();
const { createCard, getCards, deleteCard, addLike, removeLike } = require('../controllers/cards.js');

router.post('/', createCard);
router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;