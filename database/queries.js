import pool from '../db.js';

export const insert = () => {
    let q = `INSERT INTO project(project_name, user_created)
            VALUES(?,?)`;
    let val = ['Project2', 'Sam'];

    // execute the insert statment
    pool.query(q, val, (err, results, fields) => {
        if (err) {
            console.log(err.message);
            return err;
        }
        // get inserted id
        console.log('Todo Id:' + results.insertId);

        return results.insertId;
    });

}

export const del = () => {

}