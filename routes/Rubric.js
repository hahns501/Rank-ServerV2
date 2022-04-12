import express from 'express'

import {createRubric, getAllRubrics, deleteRubric} from "../controllers/Rubric.js";

const router = express.Router();

router.get('', getAllRubrics);
router.post('/create', createRubric);
router.delete('/:id', deleteRubric);

export default router