import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    user: 'Shang', // e.g. 'my-db-user'
    password: 'yoloswag420', // e.g. 'my-db-password'
    database: 'imageranker', // e.g. 'my-database'
    host: '35.223.39.32', // e.g. '127.0.0.1'
    port: '3306', // e.g. '3306'
    // ... Specify additional properties here.
});


export default pool