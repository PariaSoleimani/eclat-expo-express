import express from 'express';
import { addWishlistItem, getWishlist, removeWishlistItem } from '#controllers/wishlist.js';
import authorizeUser from '#middleware/authorizeUser.js';

const router = express.Router();

router.use(authorizeUser);

router.get('/', getWishlist);
router.post('/items', addWishlistItem);
router.delete('/items/:productId', removeWishlistItem);

export default router;
