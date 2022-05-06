import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mysql from 'mysql';
import AWS from 'aws-sdk';

import pool from './db.js';

import userRoutes from './routes/User.js';
import rubricRoutes from './routes/Rubric.js';
import dicomRoutes from './routes/Dicom.js';
import projectRoutes from './routes/Project.js';
import imageRoutes from './routes/Image.js';

import {insert} from './database/queries.js';

import 'dotenv/config';

const app = express()


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

app.get('/', (req, res) => {
    res.send('Hello from App Engine!');
});


app.use('/user', userRoutes);
app.use('/rubric', rubricRoutes);
app.use('/dicom', dicomRoutes);
app.use('/project', projectRoutes);
app.use('/image', imageRoutes);


