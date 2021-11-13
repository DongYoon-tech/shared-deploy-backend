const { Client } = require("pg");
const { DB_URI } = require("./config");

if (process.env.NODE_ENV === "production") {
    const db = new Client({
        connectionString: DB_URI,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client({
        connectionString: DB_URI
    })
}


db.connect();

module.exports = db;
