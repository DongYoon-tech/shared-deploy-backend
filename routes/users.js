/** Routes for users. */

const express = require('express');
const ExpressError = require('../helpers/expressError');
const { ensureCorrectUser, authRequired } = require('../middleware/auth');
const User = require('../models/User');
const { validate } = require('jsonschema');
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");
const createToken = require('../helpers/createToken');

const router = express.Router();

/** GET / => {users: [user, ...]} */
// authRequired
router.get('/', async function (req, res, next) {
    try {
        const users = await User.findAll();
        return res.json({ users });
    } catch (err) {
        return next(err);
    }
});

/** GET /[username] => {user: user} */

router.get('/:username', async function (req, res, next) {
    try {
        const user = await User.findOne(req.params.username);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** POST / {userdata}  => {token: token} */

router.post('/', async function (req, res, next) {
    try {
        const validation = validate(req.body, userNewSchema);

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

/** PATCH /[handle] {userData} => {user: updatedUser} */
router.patch('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        if ('username' in req.body) {
            throw new ExpressError(
                'You are not allowed to change username',
                400);
        }

        const validation = validate(req.body, userUpdateSchema);
        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const user = await User.update(req.params.username, req.body);
        return res.json({ user });
    } catch (err) {
        return next(err);
    }
});

/** DELETE /[handle]  =>  {message: "User deleted"}  */

router.delete('/:username', ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({ message: 'User deleted' });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
