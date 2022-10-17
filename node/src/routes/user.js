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

        if (req.body.email != null && req.body.username != null && req.body.password != null) {

            var conn = db.getDB();
            var lastUser = await conn.collection('users').find({}).sort({_id:-1}).limit(1).toArray();
            
            var lastUuid = 0;
            if (lastUser.length > 0) {
                
                lastUuid = lastUser[0].uuid + 1
                
            }
    
            conn.collection('users').insertOne({ 
                uuid: lastUuid, 
                email: req.body.email,
                username: req.body.username, 
                password: req.body.password,
                servers: []
            });
    
            res.json({"Status": "Ok"});

        } else {

            res.status(400);
            res.json({ "Status": "Missing user information" });

        }

});

router.route('/login')
    .post(async (req, res) => {

        if (req.body.username != null && req.body.password != null) {


            var conn = db.getDB();
            var users = await conn.collection('users').find({ username: req.body.username, 
                password: req.body.password }).limit(1).toArray();
    
            if (users.length > 0) {
    
                var token = userTokens.generateToken();
                userTokens.getTokens().set(token, users[0].uuid);
    
                res.json({ "Status": "Ok", "token": token});
    
            } else {
    
                res.status(401);
                res.json({ "Status": "Failed login" });
    
            }

        } else {

            res.status(400);
            res.json({ "Status": "Missing user information" });

        }

});

router.route('/logout')
    .post(async (req, res) => {

        var uuid = parseInt(req.body.uuid);

        if (uuid != null && req.body.token != null) {

            if (userTokens.getTokens().get(req.body.token) == uuid) {
    
                userTokens.getTokens().delete(req.body.token);
                res.json({"Status": "Ok"})
    
            } else {
    
                res.status(401);
                res.json({"Status": "Could not logout user"});
    
            }

        } else {

            res.status(400);
            res.json({ "Status": "Missing user information" });

        }

});

router.route('/delete')
    .post(async (req, res) => {
        var uuid = parseInt(req.body.uuid);

        if (uuid != null && req.body.token != null && req.body.password != null) {

            var conn = db.getDB();
            var users = await conn.collection('users').find({ uuid: uuid, password: req.body.password }).limit(1).toArray();
    
            if (users.length > 0) {
    
                if (users[0].uuid == userTokens.getTokens().get(req.body.token)) {
    
                    for (var i = 0; i < users[0].servers.length; i++) {
    
                        await conn.collection('servers').updateOne({ usid: users[0].servers[i] }, {
                            $pull: {
                                users: uuid
                            }
                        });

                        await conn.collection('servers').updateOne({ usid: users[0].servers[i] }, {
                            $pull: {
                                usernames: users[0].username
                            }
                        });
    
                    }
    
                    await conn.collection('users').deleteOne({ uuid: uuid, password: password});

                    userTokens.getTokens().forEach((eUuid, eToken) => {

                        if (eUuid == uuid) {

                            userTokens.getTokens().delete(eToken);

                        }

                    });

    
                    res.json({"Status": "Ok"});
    
                } else {
    
                    res.status(404);
                    res.json({ "Status": "Token does not exist" });
    
                }
    
            } else {
    
                res.status(400);
                res.json({ "Status": "Failed to find user" });
    
            }

        }


});

module.exports = router;