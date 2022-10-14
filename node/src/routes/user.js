const express = require('express');
const db = require('../db/conn');

const router = express.Router();

router.get('/', async (req, res) => {

    username = req.query.username;
    if (username != "") {

        var conn = db.getDB();
        var users = await conn.collection('users').find({}).toArray();

        res.send(users);

    }

});

module.exports = router;