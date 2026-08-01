import express from 'express';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '#controllers/cart.js';
import authorizeUser from '#middleware/authorizeUser.js';

const router = express.Router();

router.use(authorizeUser);

router.get('/', getCart);
router.post('/items', addCartItem);
router.patch('/items/:id', updateCartItem);
router.delete('/items/:id', removeCartItem);

export default router;
