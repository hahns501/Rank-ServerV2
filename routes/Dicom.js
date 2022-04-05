import express from 'express';
import {getImages, getFolders} from "../controllers/Dicom.js";

const router = express.Router();

router.get('/folders', getFolders);
router.get('/images', getImages);

export default router

