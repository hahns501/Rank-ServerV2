import pool from '../db.js';

export const getImagesByProject = async (req,res) => {
    const {project_id} = req.body;
    console.log("getImagesByProject");
    console.log(project_id)

    try{
        let q = `select image_path from images where project_id = ${project_id};`;
        console.log(q);
        pool.query(q, function (err,results, fields) {
        // console.log(results[0]);
            let result = JSON.parse(JSON.stringify(results))
            const final = result.map(e => e.image_path)
            res.status(200).json(final);
         })


    }catch(err){
        console.log(err);
        res.send(400).message("Not Good");
    }
}

export const getUserProjects = async (req,res) => {
    if (req.user.role === 'admin'){
        res.status(200).send('');
    }


    console.log('Inside getUserProjects');
    let id = req.user.id;

    console.log(id);

    // add project id

    let q = 'select p.project_id, p.project_name from project_user as pu inner join project as p on pu.project_id = p.project_id inner join user as u where u.user_id = (?)';

    try{
        let data = await pool.query(q, id);
        console.log(data[0]);
        // let projects = data[0].map(p => p.project_name);

        res.status(200).json(data[0]);
    }catch(err){
        console.log(err);
    }

}

export const createProject = async (req, res) => {
    const data = req.body;

    let {ProjectName, ProjectCreator} = data;

    let q = `INSERT INTO project(project_name, user_created)
            VALUES(?,?)`;
    let val = ['Project10', 'Sam'];

    // execute the insert statement
    try{
        const result = await pool.query(q, val);

        let {insertId} = result[0];

        res.status(200).json(insertId);
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }

    // const currId = await pool.query(q, val, (err, results) => {
    //     if (err) {
    //         res.status(400).json(err);
    //     }
    //     // get inserted id
    //     return {insertId} = results[0];
    // });
    //
    // console.log(currId);
    //
    // res.status(200).json(currId);
}

