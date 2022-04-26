import express from 'express';

import {Verify} from "../middleware/Verify.js";

import {getAllImageSets} from "../controllers/Image.js";

const router = express.Router();

router.get('', getAllImageSets);

export default router