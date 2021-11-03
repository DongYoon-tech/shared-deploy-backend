
const express = require('express');
const ExpressError = require('../helpers/ExpressError');
const { authRequired } = require('../middleware/auth');
const Hobby = require('../models/Hobby');
const { validate } = require('jsonschema');
const hobbyNewSchema = require("../schemas/hobbyNew.json");
const hobbyUpdateSchema = require("../schemas/hobbyUpdate.json");

const router = express.Router({ mergeParams: true });


router.get('/', async function (req, res, next) {
    try {
        const hobbies = await Hobby.findAll(req.query);
        return res.json({ hobbies });
    } catch (err) {
        return next(err);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        const hobby = await Hobby.findOne(req.params.id);
        return res.json({ hobby });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {
        const validation = validate(req.body, hobbyNewSchema);

        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const hobby = await Hobby.create(req.body);
        return res.status(201).json({ hobby });
    } catch (err) {
        return next(err);
    }
});

router.patch('/:id', async function (req, res, next) {
    try {
        if ('id' in req.body) {
            throw new ExpressError('You are not allowed to change the ID', 400);
        }

        const validation = validate(req.body, hobbyUpdateSchema);
        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const hobby = await Hobby.update(req.params.id, req.body);
        return res.json({ hobby });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await Hobby.remove(req.params.id);
        return res.json({ message: 'Hobby deleted' });
    } catch (err) {
        return next(err);
    }
});

// router.post('/:id/apply', authRequired, async function(req, res, next) {
//   try {
//     const state = req.body.state || 'applied';
//     await Job.apply(req.params.id, res.locals.username, state);
//     return res.json({ message: state });
//   } catch (err) {
//     return next(err);
//   }
// });


module.exports = router;
