const mysql = require('mysql');
require('dotenv/config');

class AppController {
    constructor() {
        this.connection = mysql.createConnection({
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            host: process.env.HOSTNAME,
            database: process.env.DATABASE
        });
        this.connection.connect();
    }

    connection = null;
}

module.exports = AppController;