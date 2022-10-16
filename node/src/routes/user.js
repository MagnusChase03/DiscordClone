const express = require('express');
const db = require('../db/conn');
const userTokens = require('../db/userTokens');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {

        var token = req.headers.token;
        if (token != null) {

            var uuid = userTokens.getTokens().get(token);
            if (uuid != null) {                

                var conn = db.getDB();
                var users = await conn.collection('users').find({ uuid: uuid }, {projection: {password: 0}}).limit(1).toArray();

                res.json({ "Status": "Ok", "user": users[0] });     

            } else {

                res.status(404);
                res.json({"Status": "Token does not exit"});
            
            }

        } else {

            res.status(400);
            res.json({ "Status": "No token given" });

        }

    })
    .post(async (req, res) => {

        var conn = db.getDB();
        var lastUser = await conn.collection('users').find({}).sort({_id:-1}).limit(1).toArray();

        conn.collection('users').insertOne({ 
            uuid: lastUser[0].uuid + 1, 
            email: req.body.email,
            username: req.body.username, 
            password: req.body.password,
            servers: []
        });

        res.json({"Status": "Ok"});

});

router.route('/login')
    .post(async (req, res) => {
        var username = req.body.username;
        var password = req.body.password;

        var conn = db.getDB();
        var users = await conn.collection('users').find({username: username, password: password}).limit(1).toArray();

        if (users.length > 0) {

            var token = userTokens.generateToken();
            userTokens.getTokens().set(token, users[0].uuid);

            res.json({ "Status": "Ok", "token": token});

        } else {

            res.status(401);
            res.json({ "Status": "Failed login" });

        }

});

router.route('/logout')
    .post(async (req, res) => {

        var uuid = req.body.uuid;
        var token = req.body.token;

        if (userTokens.getTokens().get(token) == parseInt(uuid)) {

            userTokens.getTokens().delete(token);
            res.json({"Status": "Ok"})

        } else {

            res.status(401);
            res.json({"Status": "Could not logout user"});

        }

});

module.exports = router;