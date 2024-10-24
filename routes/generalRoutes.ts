import express from 'express';

import { getLandingImage } from "../controllers/generalController";

const router = express.Router();

router.get('/landing', getLandingImage);

export default router;
