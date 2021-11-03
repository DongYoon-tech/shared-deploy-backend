
//need to be updated to address instead of hobby

const express = require('express');
const ExpressError = require('../helpers/ExpressError');
const { authRequired } = require('../middleware/auth');
const Address = require('../models/address');
const { validate } = require('jsonschema');
const addressNewSchema = require("../schemas/addressNew.json");
const addressUpdateSchema = require("../schemas/addressUpdate.json");

const router = express.Router({ mergeParams: true });

// authrequired removed
router.get('/', async function (req, res, next) {
    try {
        const addresses = await Address.findAll(req.query);
        return res.json({ addresses });
    } catch (err) {
        return next(err);
    }
});

// authrequired removed
router.get('/:id', async function (req, res, next) {
    try {
        const address = await Address.findOne(req.params.id);
        return res.json({ address });
    } catch (err) {
        return next(err);
    }
});

router.post('/', async function (req, res, next) {
    try {

        const validation = validate(req.body, addressNewSchema);

        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const address = await Address.create(req.body);
        return res.status(201).json({ address });
    } catch (err) {
        return next(err);
    }
});

router.patch('/:id', async function (req, res, next) {
    try {
        if ('id' in req.body) {
            throw new ExpressError('You are not allowed to change the ID', 400);
        }

        const validation = validate(req.body, addressUpdateSchema);
        if (!validation.valid) {
            throw new ExpressError(validation.errors.map(e => e.stack), 400);
        }

        const address = await Address.update(req.params.id, req.body);
        return res.json({ address });
    } catch (err) {
        return next(err);
    }
});

router.delete('/:id', async function (req, res, next) {
    try {
        await Address.remove(req.params.id);
        return res.json({ message: 'Address deleted' });
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
