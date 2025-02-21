import express from 'express';

import {
    addAddress,
    deleteAddress,
    findAddressByUserId,
    getAddresses,
    updateAddress
} from '../controllers/addressController';

const router = express.Router();

router.get('/', getAddresses);
router.get('/:userId', findAddressByUserId);
router.post('/', addAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;
