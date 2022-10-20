db = new Mongo().getDB("DiscordClone");

db.users.insertOne({uuid: 0, email: "root@root.com", username: "root", password: "root", servers: [0]});
db.servers.insertOne({ usid: 0, name: "rootServer", owner: 0, users: [0], usernames: ["root"], messages: [{ umid: 0, user: 0, username: "root", date: 1665776198931, content: "Hello World!"}] });
db.userTokens.insertOne({uuid: 0, token: "000000000000000000"});
db.serverTokens.insertOne({usid: 0, token: "000000000000000000"});