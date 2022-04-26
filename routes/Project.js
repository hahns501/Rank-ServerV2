import express from 'express';

import {getImagesByProject, createProject, getUserProjects, getAllProjects, deleteProject, getUserProjectDetails, submitProjectData} from "../controllers/Project.js";
import {Verify} from '../middleware/Verify.js';


const router = express.Router();


router.get('/', Verify, getUserProjects);
router.get('/detail/:id', Verify, getUserProjectDetails);
router.get('/path', getImagesByProject);
router.post('/create', createProject);
router.get('/all', getAllProjects);
router.delete('/delete/:id', deleteProject);
router.post('/submit', Verify, submitProjectData);

export default router

