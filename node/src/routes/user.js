const express = require('express');
const conn = require('../db/conn');
const db = require('../db/conn');

const router = express.Router();

var tokens = new Map();

function generateToken() {
    let result = [];
    let hexRef = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    for (let n = 0; n < 12; n++) {
        result.push(hexRef[Math.floor(Math.random() * 16)]);
    }
    return result.join('');
}


router.route('/')
    .get(async (req, res) => {

        var token = req.query.token;
        if (token != null) {

            var uuid = tokens.get(token);
            if (uuid != null) {

                var conn = db.getDB();
                var users = await conn.collection('users').find({uuid: uuid}).limit(1).toArray();
        
                res.json({"Status": "Ok", "user": users[0]});

            } else {

                res.json({"Status": "Token does not exit"});
            
            }

        } else {

            res.json({ "Status": "No token given" });

        }

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

router.route('/login')
    .post(async (req, res) => {

        var conn = db.getDB();
        var users = await conn.collection('users').find({}).toArray();

        var username = req.body.username;
        var password = req.body.password;
        var found = false;

        for (var  i = 0; i < users.length; i++) {

            if (users[i].username == username && users[i].password == password) {

                // Create token
                var token = generateToken();
                tokens.set(token, users[i].uuid);
                found = true;

                res.json({"Status": "Ok", "token": token});

            }

        }

        if (!found) {

            res.json({ "Status": "Failed login" });

        }

});

module.exports = router;