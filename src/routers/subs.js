const express = require("express");
const router = new express.Router();
const Subs = require("../models/subs");
const Users = require("../models/users");
const auth = require('../middleware/auth');

router.get('/subs', auth, async (r,s) => {
    try {
        if (r.query.d){
            const subs = await Subs.findOne({
                domain: r.query.d,
                owner: r.user._id});
            if (!subs){
                s.status(404).send({msg: "not found"})
            } else {
                s.send(subs)
            }
        } else {
            const sort = {};
            if (r.query.sortBy){
                const parts = r.query.sortBy.split(':');
                sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            }
            await r.user.populate({
                path: 'Subs',
                options: {
                limit: parseInt(r.query.l),
                skip: parseInt(r.query.s),
                sort}
            }).execPopulate();
            s.send(r.user.Subs)
        }
    } catch (e) {
        s.status(500).send()
    }
});

router.post('/subs', auth, async (r,s) => {
    try {
        const subs = await new Subs({
            ...r.body,
            owner: r.user._id});
        await subs.save();
        s.status(201).send(subs.subdomains)
    } catch (e) {
        s.status(500).send()
    }
});

router.put('/subs', auth, async (r,s) => {
    const body = Object.keys(r.body);
    const allowUpdates = ['domain','subdomains'];
    const isValid = body.every((update) => allowUpdates.includes(update));
    if (!isValid){
        s.status(400).send({error: "invalid updates"});
        return;
    }
    try {
        const subs = await Subs.findOneAndUpdate({
            domain: r.query.d,
            owner: r.user._id}, {
            ...r.body
        });
        await subs.save();
        if (!subs){
            s.status(404).send({msg: "not found"});
            return;
        }
        s.send({...r.body})
    } catch (e) {
        s.status(500).send()
    }
});

router.delete('/subs', auth, async (r,s) => {
    try {
        const subs = await Subs.findOne({domain: r.query.d, owner: r.user._id});
        await subs.remove();
        if (!subs){
            s.status(404).send({msg: "not found"});
            return;
        }
        s.send({msg: "subdomains deleted"})
    } catch (e) {
        s.status(500).send()
    }
});

module.exports = router;