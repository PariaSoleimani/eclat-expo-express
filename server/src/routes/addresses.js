import express from 'express';
import {
	createAddress,
	getAddresses,
	removeAddress,
	updateAddressById,
} from '#controllers/addresses.js';
import authorizeUser from '#middleware/authorizeUser.js';

const router = express.Router();

router.use(authorizeUser);

router.get('/', getAddresses);
router.post('/', createAddress);
router.patch('/:id', updateAddressById);
router.delete('/:id', removeAddress);

export default router;
