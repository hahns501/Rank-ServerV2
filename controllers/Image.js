import pool from '../db.js';

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