import express from 'express';

import { getLandingImage, getSectionsImage } from "../controllers/generalController";

const router = express.Router();

router.get('/landing', getLandingImage);
router.get('/section', getSectionsImage);


export default router;
