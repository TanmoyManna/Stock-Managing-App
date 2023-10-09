const mysql = require('mysql2/promise');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'stockApplication',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};
console.info("creating connection pool");
const connectionPool = mysql.createPool(dbConfig);
console.info("connection pool created successfully for MySql on '" + dbConfig.host + "'");
module.exports = connectionPool;