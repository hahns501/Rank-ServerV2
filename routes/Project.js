import express from 'express';

import {getImagesByProject, createProject, getUserProjects} from "../controllers/Project.js";
import {Verify} from '../middleware/Verify.js';


const router = express.Router();


router.get('/', Verify, getUserProjects);
router.get('/path', getImagesByProject);
router.get('/create', createProject);


export default router

