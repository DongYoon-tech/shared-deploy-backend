"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "test";

const PORT = +process.env.PORT || 4000;

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "project-test";
} else {
    DB_URI = process.env.DATABASE_URL || "shared";
}

module.exports = {
    SECRET_KEY,
    PORT,
    DB_URI
};
