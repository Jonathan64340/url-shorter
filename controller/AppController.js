const mysql = require('mysql2');
require('dotenv/config');

class AppController {
    constructor() {
        this.connection = mysql.createPool({
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: process.env.HOSTNAME,
            database: process.env.DATABASE,
            connectionLimit: 100,
            waitForConnections: true,
            queueLimit: 0
        });
    }

    connection = null;
}

module.exports = AppController;