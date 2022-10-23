const express = require('express');
const db = require('../db/conn');
const redis = require('ioredis');
const bcrypt = require('bcrypt');
const tokenGen = require('../db/tokens');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {

        var token = req.headers.token;
        if (token != null) {

            // var uuid = userTokens.getTokens().get(token);
            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({token: token}).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(token);

            if (tokenUuid != null) {                

                var users = await conn.collection('users').find({ uuid: parseInt(tokenUuid) }, {projection: {password: 0}}).limit(1).toArray();
                if (users.length > 0) {

                    res.json({ "Status": "Ok", "user": users[0] });     

                } else {

                    res.status(404);
                    res.json({"Status": "User does not exist"})

                }


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

            var existingUser = await conn.collection('users').find({email: req.body.email}).toArray();
            if (existingUser.length <= 0) {

                var lastUser = await conn.collection('users').find({}).sort({_id:-1}).limit(1).toArray();
            
                var lastUuid = 0;
                if (lastUser.length > 0) {
                    
                    lastUuid = lastUser[0].uuid + 1
                    
                }
        
                var hash = bcrypt.hashSync(req.body.password, 10);

                conn.collection('users').insertOne({ 
                    uuid: lastUuid, 
                    email: req.body.email,
                    username: req.body.username, 
                    password: hash,
                    servers: []
                });
        
                res.json({"Status": "Ok"});

            } else {

                res.status(401);
                res.json({"Status": "Email in use"});

            }

        } else {

            res.status(400);
            res.json({ "Status": "Missing user information" });

        }

});

router.route('/update')
    .post(async (req, res) => {

        if (req.body.uuid != null && req.body.password != null && req.body.token != null && (req.body.username != null || req.body.newPassword != null || req.body.email != null)) {

            var uuid = parseInt(req.body.uuid);

            var conn = db.getDB();
            var users = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();
    
            if (users.length > 0) {
                
                if (bcrypt.compareSync(req.body.password, users[0].password)) {
                    
                    // var matchingToken = await conn.collection('userTokens').find({token: req.body.token}).limit(1).toArray();
                    var client = new redis(6379, "redis");

                    client.on("error", error => {
                        console.log(error);
                    });

                    var tokenUuid = await client.get(req.body.token);

                    if (tokenUuid != null) { 

                        if (parseInt(tokenUuid) == users[0].uuid) {
                     
                            var newUsername = users[0].username;
                            var newPassword = users[0].password;
                            var newEmail = users[0].email;
                    
                            if (req.body.username != null) {

                                newUsername = req.body.username;

                            }

                            if (req.body.newPassword != null) {

                                newPassword = bcrypt.hashSync(req.body.newPassword, 10);

                            }

                            if (req.body.email != null) {

                                newEmail = req.body.email;

                            }
        
                            await conn.collection('users').updateOne({ uuid: users[0].uuid }, {
    
                               $set: {

                                    username: newUsername,
                                    password: newPassword,
                                    email: newEmail

                                }

                            });

                            res.json({ "Status": "Ok"});


                        } else {

                            res.status(401);
                            res.json({"Status": "Failed auth"});

                        }

                    } else {

                        res.status(404);
                        res.json({"Status": "Token not found"});

                    }

                    
                } else {

                    res.status(401);
                    res.json({"Status": "Failed auth"})

                }
    
            } else {
    
                res.status(404);
                res.json({ "Status": "User not found" });
    
            }

        } else {

            res.status(400);
            res.json({ "Status": "Missing uuid, token, password, or new information" });

        }

});

router.route('/login')
    .post(async (req, res) => {

        if (req.body.email != null && req.body.password != null) {

            var conn = db.getDB();
            var users = await conn.collection('users').find({ email: req.body.email }).limit(1).toArray();
    
            if (users.length > 0) {

                if (bcrypt.compareSync(req.body.password, users[0].password)) {

                    var token = tokenGen.generateToken();
                    var client = new redis(6379, "redis");

                    client.on("error", error => {
                        console.log(error);
                    });

                    await client.set(token, "" + users[0].uuid, "EX", 3600);
                    // await conn.collection('userTokens').insertOne({uuid:users[0].uuid, token: token});
                    // userTokens.getTokens().set(token, users[0].uuid);
    
                   res.json({ "Status": "Ok", "token": token});

                } else {

                    res.status(401);
                    res.json({"Status": "Failed auth"})

                }
    
            } else {
    
                res.status(404);
                res.json({ "Status": "User does not exist" });
    
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

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({token: req.body.token}).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.body.token);

            if (tokenUuid != null) {
                
                if (parseInt(tokenUuid) == uuid) {
        
                    // await conn.collection('userTokens').deleteOne({uuid: matchingToken[0].uuid, token: matchingToken[0].token});
                    // userTokens.getTokens().delete(req.body.token);
                    await client.getdel(req.body.token);
                    res.json({"Status": "Ok"})
        
                } else {
        
                    res.status(401);
                    res.json({"Status": "Could not logout user"});
        
                }

            } else {

                res.status(404);
                res.json({"Status": "No token found"})

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
            var users = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();
    
            if (users.length > 0) {

                if (bcrypt.compareSync(req.body.password, users[0].password)) {

                    // var matchingToken = await conn.collection('userTokens').find({token: req.body.token}).limit(1).toArray();
                    var client = new redis(6379, "redis");

                    client.on("error", error => {
                        console.log(error);
                    });

                    var tokenUuid = await client.get(req.body.token);

                    if (tokenUuid != null) {

                        if (users[0].uuid == parseInt(tokenUuid)) {
    
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
        
                           await conn.collection('users').deleteOne({ uuid: users[0].uuid, password: users[0].password });
                           // await conn.collection('userTokens').deleteMany({uuid: users[0].uuid});
    
                        // userTokens.getTokens().forEach((eUuid, eToken) => {
    
                        //     if (eUuid == uuid) {
    
                        //         userTokens.getTokens().delete(eToken);
    
                        //     }
    
                        // });
    
        
                            res.json({"Status": "Ok"});
                       } else {
        
                            res.status(404);
                            res.json({ "Status": "Token does not exist" });
        
                        }

                    } else {

                        res.status(404);
                        res.json({"Status": "Token not found"});

                    }
    
                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }
    
        
            } else {
    
                res.status(400);
                res.json({ "Status": "Failed to find user" });
    
            }

        }


});

module.exports = router;
