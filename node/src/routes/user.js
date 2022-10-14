const express = require('express');
const conn = require('../db/conn');
const db = require('../db/conn');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {

        var conn = db.getDB();
        var users = await conn.collection('users').find({}).toArray();

        res.send(users);

    })
    .post(async (req, res) => {

        var conn = db.getDB();
        var lastUser = await conn.collection('users').find({}).sort({_id:-1}).limit(1).toArray();

        conn.collection('users').insertOne({ 
            uuid: lastUser[0].uuid + 1, 
            username: req.body.username, 
            password: req.body.password 
        });

        res.json({"Stauts": "Ok"});

    });

module.exports = router;