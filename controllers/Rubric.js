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


export const deleteRubric = async(req,res) => {
    let {id} = req.params;

    let delQuestionsQuery = `delete from question where question.rubric_id = ${id}`;
    let delRubricQuery = `delete from rubric where rubric.rubric_id = ${id}`;

    try{
        await pool.query(delQuestionsQuery);
    }catch(err){
        console.log(err);
        res.status(400).send('Error deleting questions');
    }

    try{
        await pool.query(delRubricQuery);
    }catch(err){
        console.log(err);
        res.status(400).send('Error deleting rubric');
    }

    console.log("Delete Success");

    res.status(200).send('Good');
}

export const getAllRubrics = async (req, res) => {
    try{
        let q = 'select r.rubric_id, q.question_id,r.rubric_title, q.question, r.created_at, q.description, q.min, q.max from rubric as r inner join question as q on q.rubric_id = r.rubric_id;';

        let rubrics = await pool.query(q);

        let data = rubrics[0];

        const result = data.reduce((q, {rubric_id,question_id, rubric_title, question, description, questions, created_at, min, max}) =>{
            q[rubric_id] = q[rubric_id] ?? {
                rubric_id: rubric_id,
                rubric_title: rubric_title,
                created_at: created_at,
                questions: [],
            };

            let ques = {
                question_id: question_id,
                question:question,
                description: description,
                min: min,
                max: max,
            }

            if(Array.isArray(questions)){
                q[rubric_id] = q[rubric_id].questions.concat(questions);
            }else{
                q[rubric_id].questions.push(ques);
            }

            return q
        },{});


        // const result = data.map((v) => {
        //     let question = {
        //         question_id: v.question_id,
        //         question: v.question,
        //         description: v.description,
        //         min: v.min,
        //         max: v.max,
        // }
        //
        // console.log(question)
        // })

        // const result = data.map((v)=>{
        //     console.log(v);
        // })


        // console.log(result);


        res.status(200).json(result);
    }catch(err){
        console.log(err);
        res.status(400).send("Database error");
    }
}

export const createRubric = async (req, res) => {
    const data = req.body;

    console.log(data);

    let {rubric_title, questions} = data;

    console.log(rubric_title);

    console.log(questions);
    let currId = await insertRubric(rubric_title);

    if(!currId){
        res.status(400).send("db rubric insertion error");
    }

    let result = insertQuestions(questions, currId);

    if (!result){
        res.status(400).send("db question insertion error")
    }

    res.status(200).send("Howdy");
}

