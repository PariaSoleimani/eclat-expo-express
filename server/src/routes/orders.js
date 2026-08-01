import express from 'express';
import { createOrder, getOrderById, getOrders } from '#controllers/orders.js';
import authorizeUser from '#middleware/authorizeUser.js';

const router = express.Router();

router.use(authorizeUser);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/:id', getOrderById);

export default router;
