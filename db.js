import mysql from 'mysql2/promise';

import 'dotenv/config';

const pool = mysql.createPool({
    user: process.env.DB_USER, // e.g. 'my-db-user'
    password: process.env.DB_PASSWORD, // e.g. 'my-db-password'
    database: process.env.DB_DATABASE, // e.g. 'my-database'
    host: process.env.DB_HOST, // e.g. '127.0.0.1'
    port: process.env.DB_PORT, // e.g. '3306'
    // ... Specify additional properties here.
});


export default pool