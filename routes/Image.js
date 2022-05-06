import express from 'express';

import {Verify} from "../middleware/Verify.js";

import {getAllImageSets, uploadImage} from "../controllers/Image.js";

const router = express.Router();

router.get('', getAllImageSets);
router.post('/upload', uploadImage);

export default router