import pool from '../db.js';

const insertRubric = async (name) => {
    let q = `insert into rubric (rubric_title) values (?)`

    try{
        const result = await pool.query(q, name);
        let {insertId} = result[0];

        return insertId
    }catch(err){
        console.log(err);

        return null
    }

}

const insertQuestions = async (questions, rubricId) => {
    console.log(questions);

    let q = 'insert into question(rubric_id, question, description, min, max) values ?';

    let val = questions.map(v => {
        let arr = [];
        arr.push(rubricId);
        Object.values(v).map(e => arr.push(e))

        return arr
    });

    console.log(val);

    try{
        await pool.query(q, [val]);

        return true
    }catch(err){
        console.log(err)

        return false
    }
}

const selectRubric = () => {
    let q = 'select rubric_id, rubric_title from rubric';
}

export const getAllRubrics = async (req, res) => {
    try{
        let q = 'select rubric_id, rubric_title from rubric';
        let rubrics = await pool.query(q);
        res.status(200).json(rubrics[0]);
    }catch(err){
        console.log(err);
        res.status(400).send("Database error");
    }
}

export const createRubric = async (req, res) => {
    const data = req.body;

    let {rubric_name} = data.shift();

    console.log(rubric_name);
    let currId = await insertRubric(rubric_name);


    if(!currId){
        res.status(400).send("db rubric insertion error");
    }

    let result = insertQuestions(data, currId);

    if (!result){
        res.status(400).send("db question insertion error")
    }

    res.status(200).send("Howdy");
}