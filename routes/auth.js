/** Routes for authentication. */

const User = require("../models/User");
const express = require("express");
const ExpressError = require('../helpers/ExpressError');
const router = new express.Router();
const createToken = require("../helpers/createToken");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { validate } = require('jsonschema');

router.post("/login", async function (req, res, next) {
    try {
        const validation = validate(req.body, userAuthSchema);
        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }
        const user = await User.authenticate(req.body);
        const token = createToken(user);
        return res.json({ token });
    } catch (err) {
        return next(err);
    }
});


router.post("/signup", async function (req, res, next) {
    try {
        const validation = validate(req.body, userRegisterSchema);
        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const newUser = await User.register(req.body);
        const token = createToken(newUser);
        return res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
});


module.exports = router;
