import express from 'express'

import {createRubric, getAllRubrics} from "../controllers/Rubric.js";

const router = express.Router();

router.get('', getAllRubrics);
router.get('/create', createRubric);

export default router