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


export const getAllProjects = async(req,res) => {

    let query = 'select p.project_id, p.project_name, p.created_at, u.user_id, u.first_name, u.last_name, pu.rubric_id, r.rubric_title, ims.image_set_name, ims.image_set_id, pu.status from project as p inner join project_user as pu on p.project_id = pu.project_id inner join user as u on u.user_id = pu.user_id inner join rubric as r on pu.rubric_id = r.rubric_id inner join image_set as ims where ims.image_set_id = pu.image_set_id';
    try{
        let projects = await pool.query(query);

        let data = projects[0];

        const result = data.reduce((q, {project_id, created_at, project_name, rubric_id, rubric_title, user_id, first_name, last_name, status, users, image_set_id, image_set_name}) =>{
            q[project_id] = q[project_id] ?? {
                project_id: project_id,
                project_name: project_name,
                rubric_id: rubric_id,
                rubric_title: rubric_title,
                image_set_id: image_set_id,
                image_set_name: image_set_name,
                created_at: created_at,
                users: [],
            };

            let user = {
                user_id: user_id,
                first_name: first_name,
                last_name: last_name,
                status: status,
            }

            if(Array.isArray(users)){
                q[project_id] = q[project_id].users.concat(users);
            }else{
                q[project_id].users.push(user);
            }

            return q
        },{});

        for(const v in result){
            console.log(result[v]);
        }

        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(400).send(err);
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

    let q = 'select p.project_id, p.project_name, p.created_at, pu.status from project_user as pu inner join project as p where pu.project_id = p.project_id and pu.user_id = (?)';

    try{
        let data = await pool.query(q, id);
        console.log(data[0]);
        // let projects = data[0].map(p => p.project_name);

        res.status(200).json(data[0]);
    }catch(err){
        console.log(err);
    }

}

export const submitProjectData = async (req,res) => {
    let data = req.body;
    let user_id = req.user.id;
    let project_id = data[0].project_id;

    console.log(data);
    let q = `update project_user set status = 1 where project_id = ${project_id} and user_id = ${user_id};`;

    try{
        let serverRes = await pool.query(q);
        res.status(200).send('Good');
    }catch(err){
        console.log(err);
        res.status(400).send("Database Error");
    }
}

export const getUserProjectDetails = async (req,res) =>{
    let {id} = req.params;
    let user_id = req.user.id;

    let rubric_id = null;
    let imageData = null;
    let questionData = null;

    console.log(id);
    console.log(user_id);

    // get image paths
    let imageQuery = `select pu.rubric_id, i.image_id, i.image_path from project_user as pu inner join image as i on pu.image_set_id = i.image_set_id where pu.project_id = ${id} and user_id = ${user_id}`;

    try{
        let imageRecData = await pool.query(imageQuery);

        // extract rubric and create new array without rubric_id
        let tempImageData = imageRecData[0][0];
        rubric_id = tempImageData.rubric_id;

        imageData = imageRecData[0].map(({rubric_id, ...rest})=>rest);

    }catch(err){
        console.log(err);
        res.status(400).send('Database Error Retrieving Images');
    }

    // get rubric/questions
    let questionQuery = `select q.question_id, q.question, q.description, q.min, q.max from rubric as r inner join question as q on r.rubric_id = q.rubric_id where r.rubric_id=${rubric_id}`

    try{
        let questionRecData = await pool.query(questionQuery);
        questionData = questionRecData[0];

    }catch(err){
        console.log(err);
        res.status(400).send('Database Error Retrieving Questions');
    }

    // process data to send
    const data = {
        "ImageIds": imageData,
        "Questions": questionData,
    }

    console.log(data);

    res.status(200).json(data);
}

export const deleteProject = async (req, res) => {
    let {id} = req.params;

    console.log(`Delete Project, ID: ${id}`);
    res.status(200).send('Good');

    // delete project_user
    let deleteProjectUserQuery = 'delete from project_user where project_id = (?)';
    try{
        let resp = pool.query(deleteProjectUserQuery, id);
    }catch(err){
        console.log(err);
        res.status(400).send('Deletion of project user failed')
    }

    let deleteProjectQuery = 'delete from project where project_id = (?)';

    // delete project
    try{
        let resp = pool.query(deleteProjectQuery, id);
    }catch(err){
        console.log(err);
        res.status(400).send('Deletion of project failed')
    }
}

export const createProject = async (req, res) => {
    const {ProjectName, ProjectUsers, ImageID, RubricID} = req.body;

    let image_set_id = ImageID[0];
    let rubric_id = RubricID[0];

    console.log(req.body);

    let userCreated = 'Sam';

    let project_id = null;
    // Create Project
    try{
        let q = `INSERT INTO project(project_name, user_created)
            VALUES(?,?)`;

        let values = [ProjectName, userCreated];

        const result = await pool.query(q, values);

        let {insertId} = result[0];
        project_id = insertId;
    }catch(err){
        console.log(err);
        res.status(400).json(err);
    }

    // Create Project Users
    for (const e of ProjectUsers) {
        try{
            let q = `insert into project_user(project_id, user_id, image_set_id, rubric_id) values (${project_id},?,${image_set_id}, ${rubric_id})`;
            await pool.query(q, e);
        }catch(err){
            console.log(err);
            res.status(400).json(err);
        }
    }


    res.status(200).send('Good');

}

