const express = require('express');
const db = require('../db/conn');
const userTokens = require('../db/userTokens');
const serverTokens = require('../db/serverTokens');

const router = express.Router();

router.route('/')
    .get (async (req, res) => {

        var conn = db.getDB();
        var servers = await conn.collection('servers').find({}).toArray();

        res.json(servers);

    })
    .post(async (req, res) => {

        var user = userTokens.getTokens().get(req.body.token);
        if (user != null) {

            if (user == parseInt(req.body.uuid)) {

                var conn = db.getDB();
                var lastServer = await conn.collection('servers').find({}).sort({ _id: -1 }).limit(1).toArray();

                conn.collection('servers').insertOne({
                    usid: lastServer[0].usid + 1,
                    name: req.body.name,
                    owner: user,
                    users: [user],
                    messages: []
                });

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

                    await conn.collection('servers').updateOne({ usid: serverUsid }, {$push: {users: user}});
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

                        res.json({ "Status": "Ok", "messages": servers[0].messages });

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

                    var lastUmid = servers[0].messages[servers[0].messages.length - 1].umid;
                    var date = new Date().getTime();

                    await conn.collection('servers').updateOne({ usid: parseInt(req.body.usid) }, { $push: { messages: {

                        umid: lastUmid + 1,
                        date: date,
                        user: user,
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