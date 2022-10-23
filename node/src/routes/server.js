const express = require('express');
const db = require('../db/conn');
const redis = require('ioredis');
const bcrypt = require('bcrypt');
const tokenGen = require('../db/tokens');

const router = express.Router();

router.route('/')
    .get(async (req, res) => {

        if (req.headers.uuid != null && req.headers.token != null) {

            var uuid = parseInt(req.headers.uuid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.headers.token }).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.headers.token);
            // var userUuid = userTokens.getTokens().get(req.headers.token);
            if (tokenUuid != null) {

                if (parseInt(tokenUuid) == uuid) {

                    var users = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();
                    if (users.length > 0) {

                        if (req.headers.usid != null) {

                            var server = await conn.collection('servers').find({ usid: parseInt(req.headers.usid) },
                                { projection: { messages: 0 } }).limit(1).toArray();

                            if (server.length > 0) {

                                if ( server[0].users.indexOf(uuid) >= 0) {

                                    res.json({ "Stauts": "Ok", "server": server[0] });

                                } else {

                                    res.status(401);
                                    res.json({ "Status": "User not in server" });

                                }

                            } else {

                                res.status(404);
                                res.json({ "Status": "Server does not exist" });

                            }

                        } else {

                            var servers = [];
                            for (var i = 0; i < users[0].servers.length; i++) {

                                var server = await conn.collection('servers').find({ usid: users[0].servers[i] },
                                    { projection: { messages: 0 } }).limit(1).toArray();

                                servers.push(server[0]);

                            }

                            res.json({ "Status": "Ok", "servers": servers });

                        }

                    } else {

                        res.status(404);
                        res.json({ "Status": "User does not exist" })

                    }

                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exit" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token or uuid given" });

        }


    })
    .post(async (req, res) => {


        if (req.body.uuid != null && req.body.token != null && req.body.name != null) {

            var uuid = parseInt(req.body.uuid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.body.token);
            if (tokenUuid != null) {

                if (uuid == parseInt(tokenUuid)) {

                    var lastServer = await conn.collection('servers').find({}).sort({ _id: -1 }).limit(1).toArray();
                    var createdUser = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();
                    if (createdUser.length > 0) {

                        var usid = 0;
                        if (lastServer.length > 0) {

                            usid = lastServer[0].usid + 1;

                        }

                        conn.collection('servers').insertOne({
                            usid: usid,
                            name: req.body.name,
                            owner: uuid,
                            ownerUsername: createdUser[0].username,
                            users: [uuid],
                            usernames: [createdUser[0].username],
                            messages: []
                        });

                        await conn.collection('users').updateOne({ uuid: uuid }, { $push: { servers: usid } });

                        res.json({ "Stauts": "Ok" });


                    } else {

                        res.status(404);
                        res.json({ "Status": "User does not exist" });

                    }

                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exit" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, or name given" });

        }

    });

router.route('/delete')
    .post(async (req, res) => {
        // var token = req.body.token;

        if (req.body.usid != null && req.body.uuid != null && req.body.password != null && req.body.token != null) {

            var usid = parseInt(req.body.usid);
            var uuid = parseInt(req.body.uuid);

            var conn = db.getDB();
            var users = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();

            if (users.length > 0) {

                if (bcrypt.compareSync(req.body.password, users[0].password)) {

                    // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
                    var client = new redis(6379, "redis");

                    client.on("error", error => {
                        console.log(error);
                    });

                    var tokenUuid = await client.get(req.body.token);
                    if (tokenUuid != null) {

                        if (users[0].uuid == parseInt(tokenUuid)) {

                            var servers = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                            if (servers.length > 0) {

                                if (servers[0].owner == uuid) {

                                    for (var i = 0; i < servers[0].users.length; i++) {

                                        await conn.collection('users').updateOne({ uuid: servers[0].users[i] }, {
                                            $pull: {
                                                servers: usid
                                            }
                                        });

                                    }

                                    await conn.collection('servers').deleteOne({ usid: usid });
                                    // await conn.collection('serverTokens').deleteMany({ usid: usid });

                                    res.json({ "Status": "Ok" });

                                } else {

                                    res.status(401);
                                    res.json({ "Status": "Failed auth" });

                                }

                            } else {

                                res.status(404);
                                res.json({ "Status": "Server does not exist" })

                            }

                        } else {

                            res.status(401);
                            res.json({ "Status": "Failed auth" });

                        }


                    } else {

                        res.status(404);
                        res.json({ "Status": "Token does not exist" });

                    }

                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "User not found" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, usid, or password given" });

        }

    });

router.route('/leave')
    .post(async (req, res) => {
        // var token = req.body.token;

        if (req.body.usid != null && req.body.uuid != null && req.body.token != null) {

            var usid = parseInt(req.body.usid);
            var uuid = parseInt(req.body.uuid);

            var conn = db.getDB();
            var users = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();

            if (users.length > 0) {

                // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
                var client = new redis(6379, "redis");

                client.on("error", error => {
                    console.log(error);
                });

                var tokenUuid = await client.get(req.body.token);
                if (tokenUuid != null) {

                    if (users[0].uuid == parseInt(tokenUuid)) {

                        var servers = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                        if (servers.length > 0) {

                            await conn.collection('users').updateOne({ uuid: uuid }, {
                                $pull: {
                                    servers: usid
                                }
                            });

                            await conn.collection('servers').updateOne({ usid: usid }, {
                                $pull: {
                                    users: uuid
                                }
                            });

                            await conn.collection('servers').updateOne({ usid: usid }, {
                                $pull: {
                                    usernames: users[0].username
                                }
                            });
                            
                            var theServer = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                            if (theServer[0].users.length == 0) {

                                await conn.collection('servers').deleteOne({usid: usid});

                            } else if (theServer[0].owner == uuid) {

                                var newOwner = await conn.collection('users').find({uuid: theServer[0].users[0]}).limit(1).toArray();

                                await conn.collection('servers').updateOne({ usid: usid }, {
                                    $set: {
                                        owner: theServer[0].users[0],
                                        ownerUsername: newOwner[0].username 
                                    }
                                });

                            }

                            res.json({ "Status": "Ok" });

                        } else {

                            res.status(404);
                            res.json({ "Status": "Server does not exist" })

                        }

                    } else {

                        res.status(401);
                        res.json({ "Status": "Failed auth" });

                    }


                } else {

                    res.status(404);
                    res.json({ "Status": "Token does not exist" });

                }

            } else {

                res.status(401);
                res.json({ "Status": "Failed auth" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, or usid given" });

        }

    });

router.route('/invite')
    .post(async (req, res) => {

        if (req.body.uuid != null && req.body.token != null && req.body.usid != null) {

            // var user = userTokens.getTokens().get(req.body.token);
            var uuid = parseInt(req.body.uuid);
            var usid = parseInt(req.body.usid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.body.token);
            if (tokenUuid != null) {

                if (parseInt(tokenUuid) == uuid) {

                    var inviteServer = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                    if (inviteServer.length > 0) {

                        if (inviteServer[0].owner == uuid) {

                            var token = tokenGen.generateToken();
                            // serverTokens.getTokens().set(token, inviteServer[0].usid);
                            // await conn.collection('serverTokens').insertOne({ usid: inviteServer[0].usid, token: token });
                            await client.set("s" + token, "" + inviteServer[0].usid, "EX", 3600);

                            res.json({ "Stauts": "Ok", "token": token });

                        } else {

                            res.status(401);
                            res.json({ "Status": "Failed auth" });

                        }

                    } else {

                        res.status(404);
                        res.json({ "Status": "Server does not exist" });

                    }


                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exit" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, or usid given" });

        }

    });

router.route('/join')
    .post(async (req, res) => {

        if (req.body.uuid != null && req.body.token != null && req.body.serverToken != null) {

            var uuid = parseInt(req.body.uuid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
            // var user = userTokens.getTokens().get(req.body.token);
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.body.token);
            if (tokenUuid != null) {

                if (parseInt(tokenUuid) == uuid) {

                    // var matchingServerToken = await conn.collection('serverTokens').find({ token: req.body.serverToken }).limit(1).toArray();
                    var tokenUsid = await client.get("s" + req.body.serverToken);
                    if (tokenUsid != null) {

                        var tokenUsid = parseInt(tokenUsid);
                        var joinUser = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();

                        if (joinUser.length > 0) {

                            var joinServer = await conn.collection('servers').find({ usid: tokenUsid }).limit(1).toArray();
                            var isAMember = false;
                            for (var i = 0; i < joinServer[0].users.length; i++) {

                                if (joinServer[0].users[i] == uuid) {

                                    isAMember = true;
                                    break;

                                }

                            }

                            if (!isAMember) {

                                await conn.collection('servers').updateOne({ usid: tokenUsid }, { $push: { users: uuid } });
                                await conn.collection('servers').updateOne({ usid: tokenUsid }, { $push: { usernames: joinUser[0].username } });
                                await conn.collection('users').updateOne({ uuid: uuid }, { $push: { servers: tokenUsid } });

                                // await conn.collection('serverTokens').deleteOne({ token: req.body.serverToken });
                                await client.getdel("s" + req.body.serverToken);

                                res.json({ "Status": "Ok" });

                            } else {

                                res.status(401);
                                res.json({ "Status": "User is already in server" });

                            }

                        } else {

                            res.status(404);
                            res.json({ "Status": "User does not exist" });

                        }

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

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, usid, or server token given" });

        }

    });

router.route('/message')
    .get(async (req, res) => {

        if (req.headers.token != null && req.headers.uuid != null && req.headers.usid != null) {

            var uuid = parseInt(req.headers.uuid);
            var usid = parseInt(req.headers.usid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.headers.token }).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.headers.token);
            if (tokenUuid != null) {

                // var user = userTokens.getTokens().get(token);
                if (parseInt(tokenUuid) == uuid) {

                    var servers = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                    if (servers.length > 0) {

                        var isAUser = false;
                        for (var i = 0; i < servers[0].users.length; i++) {

                            if (servers[0].users[i] == uuid) {

                                isAUser = true;
                                break;

                            }

                        }

                        if (isAUser) {

                            var messages = []
                            var start = servers[0].messages.length;
                            var limit = 20;
                            if (req.headers.num != null) {

                                limit = parseInt(req.headers.num);

                            }

                            if (req.headers.oldest != null) {

                                for (var k = servers[0].messages.length - 1; k >= 0; k--) {

                                    if (servers[0].messages[k].umid == parseInt(req.headers.oldest)) {

                                        start = k;
                                        break;

                                    }

                                }

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

                        res.status(404);
                        res.json({ "Status": "Server does not exist" });

                    }


                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exist" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, or usid given" });

        }

    })
    .post(async (req, res) => {

        if (req.body.uuid != null && req.body.token != null && req.body.usid != null && req.body.content != null) {

            var uuid = parseInt(req.body.uuid);
            var usid = parseInt(req.body.usid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.body.token }).limit(1).toArray();
            // var user = userTokens.getTokens().get(req.body.token);
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.body.token);
            if (tokenUuid != null) {

                if (parseInt(tokenUuid) == uuid) {

                    var servers = await conn.collection('servers').find({ usid: usid }).limit(1).toArray();
                    if (servers.length > 0) {

                        var isAUser = false;
                        for (var i = 0; i < servers[0].users.length; i++) {

                            if (servers[0].users[i] == uuid) {

                                isAUser = true;
                                break;

                            }

                        }

                        if (isAUser) {

                            var lastUmid = -1;
                            if (servers[0].messages.length > 0) {

                                lastUmid = servers[0].messages[servers[0].messages.length - 1].umid;

                            }

                            var sentUser = await conn.collection('users').find({ uuid: uuid }).limit(1).toArray();
                            if (sentUser.length > 0) {

                                var date = new Date().getTime();
                                var message = {

                                    umid: lastUmid + 1,
                                    date: date,
                                    user: uuid,
                                    username: sentUser[0].username,
                                    content: req.body.content

                                };

                                await conn.collection('servers').updateOne({ usid: usid }, {
                                    $push: {
                                        messages: message
                                    }
                                });

                                // Update Clients
                                // var client = new redis(6379, "redis");

                                // client.on("error", error => {
                                    // console.log(error);

                                // });

                                client.publish("messages", JSON.stringify(message));

                                res.json({ "Status": "Ok" });


                            } else {

                                res.status(404);
                                res.json({ "Status": "User does not exist" })

                            }

                        } else {

                            res.status(401);
                            res.json({ "Status": "User not in server" });

                        }

                    } else {

                        res.status(404);
                        res.json({ "Status": "Server not found" });

                    }


                } else {

                    res.status(401);
                    res.json({ "Status": "Failed auth" });

                }

            } else {

                res.status(404);
                res.json({ "Status": "Token does not exit" });

            }

        } else {

            res.status(400);
            res.json({ "Status": "No token, uuid, or usid given" });

        }

    });

router.route('/message/listen')
    .get(async (req, res) => {

        if (req.query.uuid != null && req.query.token != null && req.query.usid != null) {

            var uuid = parseInt(req.query.uuid);
            var usid = parseInt(req.query.usid);

            var conn = db.getDB();
            // var matchingToken = await conn.collection('userTokens').find({ token: req.query.token }).limit(1).toArray();
            var client = new redis(6379, "redis");

            client.on("error", error => {
                console.log(error);
            });

            var tokenUuid = await client.get(req.query.token);
            if (tokenUuid != null) {

                if (parseInt(tokenUuid) == uuid) {

                    var servers = await conn.collection('servers').find({usid: usid}).limit(1).toArray();
                    if (servers.length > 0) {

                        if (servers[0].users.indexOf(uuid) >= 0) {

                            res.set({

                                "Cache-Control": "no-cache",
                                "Content-Type": "text/event-stream",
                                "Connection": "keep-alive",
                                "Access-Control-Allow-Origin": "*",
                                "X-Accel-Buffering": "no"

                            });

                            res.write("retry: 10000\n\n");
                            // DO STUFvar 
                            // var client = new redis(6379, "redis");

                            // client.on("error", error => {
                                // console.log(error);

                            // });

                            client.subscribe("messages");
                            client.on("message", (channel, message) => {

                                console.log("data: " + message + "\n\n");
                                res.write("data: " + message + "\n\n");

                            });


                            req.on('close', async () => {
                                client.disconnect();
                                console.log("Closed");

                            });

                        } else {

                            res.status(401);
                            res.json({"Status": "User not in server"});

                        }

                    } else {

                        res.status(404);
                        res.json({"Status": "Server not found"});

                    }

                } else {

                    res.status(401);
                    res.json({"Status": "Failed auth"});

                } 

            } else {

                res.status(404);
                res.json({"Status": "Token does not exist"});

            }

        } else {

            res.status(400);
            res.json({"Status": "Missing uuid, token, or usid"});

        }

    });

module.exports = router;
