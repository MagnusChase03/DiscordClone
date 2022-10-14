const express = require('express');
const db = require('../db/conn');

const router = express.Router();

router.route('/')
    .get (async (req, res) => {

        var conn = db.getDB();
        var servers = await conn.collection('servers').find({}).toArray();

        res.json(servers);

    })
    .post(async (req, res) => {

        var conn = db.getDB();
        var lastServer = await conn.collection('servers').find({}).sort({ _id: -1 }).limit(1).toArray();

        conn.collection('servers').insertOne({
            usid: lastServer[0].usid + 1,
            name: req.body.name,
            owner: parseInt(req.body.ownerUuid),
            users: [parseInt(req.body.ownerUuid)],
            messages: []
        });

        res.json({ "Stauts": "Ok" });

});

module.exports = router;