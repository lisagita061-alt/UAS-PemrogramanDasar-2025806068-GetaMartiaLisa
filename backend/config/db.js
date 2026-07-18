// Import package mysql2 (versi promise, supaya bisa pakai async/await)
const mysql = require('mysql2/promise');

// Import dotenv untuk membaca file .env
require('dotenv').config();

// Membuat "connection pool" ke database
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Export supaya bisa dipakai di file lain (controller, model)
module.exports = pool;