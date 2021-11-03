"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const ExpressError = require("../helpers/ExpressError");

function authRequired(req, res, next) {

    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, SECRET_KEY);
        }

        return next();
    } catch (err) {
        return next();
    }
}

function ensureCorrectUser(req, res, next) {
    try {
        const user = res.locals.user;
        if (!(user && (user.username === req.params.username))) {
            throw new ExpressError("Unauthorized", 401)
        }
        return next()

    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authRequired,
    ensureCorrectUser
};