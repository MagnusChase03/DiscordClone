const express = require('express');
const db = require('../db/conn');
const userTokens = require('../db/userTokens');
const serverTokens = require('../db/serverTokens');

const router = express.Router();

router.route('/')
    .get (async (req, res) => {

        var userUuid = userTokens.getTokens().get(req.headers.token);
        if (userUuid != null) {

            if (userUuid == parseInt(req.headers.uuid)) {

                var conn = db.getDB();
                var users = await conn.collection('users').find({uuid: userUuid}).limit(1).toArray();

                var servers = [];
                for (var i = 0; i < users[0].servers.length; i++) {

                    var server = await conn.collection('servers').find({ usid: users[0].servers[i] }, 
                        { projection: { messages: 0 } }).limit(1).toArray();

                    servers.push(server[0]);

                }

                res.json({"Status": "Ok", "servers": servers});

            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(404);
            res.json({ "Status": "Token does not exit" });

        }

    })
    .post(async (req, res) => {

        var user = userTokens.getTokens().get(req.body.token);
        if (user != null) {

            if (user == parseInt(req.body.uuid)) {

                var conn = db.getDB();
                var lastServer = await conn.collection('servers').find({}).sort({ _id: -1 }).limit(1).toArray();
                var createdUser = await conn.collection('users').find({uuid: user}).limit(1).toArray();
                var usid = lastServer[0].usid + 1;

                conn.collection('servers').insertOne({
                    usid: usid,
                    name: req.body.name,
                    owner: user,
                    users: [user],
                    usernames: [createdUser[0].username],
                    messages: []
                });

                await conn.collection('users').updateOne({ uuid: user }, { $push: { servers: usid } });

                res.json({ "Stauts": "Ok" });

            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(404);
            res.json({ "Status": "Token does not exit" });

        }

});

router.route('/delete')
    .post(async (req, res) => {
        var usid = req.body.usid;
        var uuid = req.body.uuid;
        var password = req.body.password;
        var token = req.body.token;

        var conn = db.getDB();
        var users = await conn.collection('users').find({ uuid: parseInt(uuid), password: password }).limit(1).toArray();

        if (users.length > 0) {

            if (users[0].uuid == userTokens.getTokens().get(token)) {

                var servers = await conn.collection('servers').find({ usid: parseInt(usid)}).limit(1).toArray();
                if (servers[0].owner == parseInt(uuid)) {

                    for (var i = 0; i < servers[0].users.length; i++) {

                        await conn.collection('user').updateOne({ uuid: servers[0].users[i] }, {
                            $pull: {
                                servers: parseInt(usid)
                            }
                        });

                    }

                    await conn.collection('servers').deleteOne({ usid: parseInt(usid)});

                    res.json({"Status": "Ok"});

                } else {

                    res.status(401);
                    res.json({ "Status": "User does not own server" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exist" });

            }

        } else {

            res.status(401);
            res.json({ "Status": "Failed to find user" });

        }

    });

router.route('/invite')
    .post(async (req, res) => {

        var user = userTokens.getTokens().get(req.body.token);
        if (user != null) {

            if (user == parseInt(req.body.uuid)) {

                var conn = db.getDB();
                var inviteServer = await conn.collection('servers').find({usid: parseInt(req.body.usid)}).limit(1).toArray();

                if (inviteServer[0].owner == user) {

                    var token = serverTokens.generateToken();
                    serverTokens.getTokens().set(token, inviteServer[0].usid);

                    res.json({ "Stauts": "Ok", "token": token});

                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }


            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(404);
            res.json({ "Status": "Token does not exit" });

        }

});

router.route('/join')
    .post(async (req, res) => {

        var user = userTokens.getTokens().get(req.body.token);
        if (user != null) {

            if (user == parseInt(req.body.uuid)) {

                var serverUsid = serverTokens.getTokens().get(req.body.serverToken);
                if (serverUsid != null) {

                    var conn = db.getDB();

                    var createdUser = await conn.collection('users').find({ uuid: user }).limit(1).toArray();

                    await conn.collection('servers').updateOne({ usid: serverUsid }, {$push: {users: user}});
                    await conn.collection('servers').updateOne({ usid: serverUsid }, { $push: { usernames: createdUser[0].username } });
                    await conn.collection('users').updateOne({ uuid: user }, { $push: { servers: serverUsid } });

                    serverTokens.getTokens().delete(req.body.serverToken);

                    res.json({"Status": "Ok"});

                } else {

                    res.status(404);
                    res.json({ "Status": "Server token does not exit" });

                }


            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(404);
            res.json({ "Status": "Token does not exit" });

        }

});

router.route('/message')
    .get(async (req, res) => {

        var token = req.headers.token;
        if (token != null) {

            var user = userTokens.getTokens().get(token);
            if (user != null) {

                if (user == parseInt(req.headers.uuid)) {

                    var conn = db.getDB();
                    var servers = await conn.collection('servers').find({ usid: parseInt(req.headers.usid) }).limit(1).toArray();

                    var isAUser = false;
                    for (var i = 0; i < servers[0].users.length; i++) {

                        if (servers[0].users[i] == user) {

                            isAUser = true;
                            break;

                        }

                    }

                    if (isAUser) {

                        var messages = []
                        var start = servers[0].messages.length;
                        var limit = 20;
                        if (req.headers.num != null) {

                            limit = req.headers.num;

                        }

                        if (req.headers.oldest != null) {

                            start = req.headers.oldest;

                        }

                        var i = start - limit;
                        if (i < 0) {

                            i = 0;

                        }

                        for (; i < start && i < servers[0].messages.length; i++) {

                            messages.push(servers[0].messages[i]);

                        }

                        res.json({ "Status": "Ok", "messages": messages });

                    } else {

                        res.status(401);
                        res.json({ "Status": "User not in server" });

                    }

                } else {

                    res.status(401);
                    res.json({"Status": "Failed auth"});

                }
                

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exit" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token given" });

        }

    })
    .post(async (req, res) => {

        var user = userTokens.getTokens().get(req.body.token);
        if (user != null) {

            if (user == parseInt(req.body.uuid)) {

                var conn = db.getDB();

                var servers = await conn.collection('servers').find({ usid: parseInt(req.body.usid) }).limit(1).toArray();

                var isAUser = false;
                for (var i = 0; i < servers[0].users.length; i++) {

                    if (servers[0].users[i] == user) {

                        isAUser = true;
                        break;

                    }

                }

                if (isAUser) {

                    var lastUmid = -1;
                    if (servers[0].messages.length > 0) {

                        lastUmid = servers[0].messages[servers[0].messages.length - 1].umid;

                    }

                    var sentUser = await conn.collection('users').find({ uuid: user }).limit(1).toArray();
                    var date = new Date().getTime();

                    await conn.collection('servers').updateOne({ usid: parseInt(req.body.usid) }, { $push: { messages: {

                        umid: lastUmid + 1,
                        date: date,
                        user: user,
                        username: sentUser[0].username,
                        content: req.body.content

                    }}});

                    res.json({"Status": "Ok"});

                } else {

                    res.status(401);
                    res.json({ "Status": "User not in server" });

                }

            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(404);
            res.json({ "Status": "Token does not exit" });

        }

    });

module.exports = router;