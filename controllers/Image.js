import pool from '../db.js';
import AWS from "aws-sdk";

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region:"us-east-1",
});

let s3 = new AWS.S3();

export const getAllImageSets = async (req,res) => {
    let q = 'select * from image_set';

    try{
        let imageSets = await pool.query(q);

        res.status(200).json(imageSets[0]);
    }catch(err){
        console.log(err);
        res.status(400).send("Database Error");
    }
}

export const uploadImage = async (req,res) => {
    let data = req.body;
    console.log(data);
    const signedUrlExpireSeconds = 60 * 15;

    try{
        const url = await s3.getSignedUrlPromise("putObject", {
            Bucket: 'imagerankerdicomtest',
            Key: `${data.file_name}/${data.files[0].path}`,
            ContentType: "dicom",
            ACL: "public-read",
            Expires: signedUrlExpireSeconds,
        });

        res.status(200).json(url);
    }catch(err){
        console.log(err);
    }
    // const url = await s3.getSignedUrlPromise("putObject", {
    //     Bucket: 'imagerankerdicomtest',
    //     Key: `${data.file_name}`,
    //     ContentType: "dicom",
    //     Expires: signedUrlExpireSeconds,
    // });
    // Get Images

    // Create Folder in s3

    // Upload to s3

}
