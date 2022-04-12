// const express = require('express');
// const app = express();
// const cors = require('cors');
// const bodyParser = require('body-parser');
//
// const userRoutes = require('./routes/User.js');

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

const app = express()


app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());

const PORT = process.env.PORT || 5000;

// Establish a connection to the database
// const pool = mysql.createPool({
//     user: 'Shang', // e.g. 'my-db-user'
//     password: 'yoloswag420', // e.g. 'my-db-password'
//     database: 'imagerankdb', // e.g. 'my-database'
//     host: '35.223.39.32', // e.g. '127.0.0.1'
//     port: '3306', // e.g. '3306'
//     // ... Specify additional properties here.
// });


// app.get('/test', (req,res) =>{
//     res.send('Ayo Test');
//
//     let q = 'select * from user'
//     pool.query(q, function (err,results, fields) {
//         // console.log(results[0]);
//         let result=JSON.parse(JSON.stringify(results))
//         console.log(result)
//     })
// });

app.get('/test', (req,res) =>{

    let temp = insert();

    res.send(temp);
});


// aws stuff

// AWS.config.update({
//     accessKeyId: "AKIARZIG7UBYCFUND2MU",
//     secretAccessKey: "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"
// });

// let s3 = new AWS.S3();

// app.get('/test', (req,res) =>{
//     var params = {
//         Bucket: 'imagerankerdicomtest', /* required */
//         // ContinuationToken: 'STRING_VALUE',
//         // Delimiter: 'STRING_VALUE',
//         EncodingType: 'url',
//         // ExpectedBucketOwner: 'STRING_VALUE',
//         // FetchOwner: true || false,
//         // MaxKeys: 'NUMBER_VALUE',
//         Prefix: 'foldertest1/',
//         // RequestPayer: requester,
//         // StartAfter: 'STRING_VALUE'
//     };
//
//     s3.listObjectsV2(params, function(err, data) {
//         if (err){
//             console.log(err, err.stack);
//         } // an error occurred
//         else {
//             let prefix = 'wadouri:https://imagerankerdicomtest.s3.amazonaws.com/';
//             let dataContents = data.Contents;
//             // let result = dataContents.map(a => prefix.concat('',a.Key));
//             let result = dataContents.map(a => `(${a.Key})`);
//
//             // removes instance of just foldername
//             result.shift();
//
//             console.log(result);
//         }
//     });
// });

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


