db = new Mongo().getDB("DiscordClone");

db.users.insertOne({uuid: 0, username: "root", password: "root", servers: [0]});
db.servers.insertOne({ usid: 0, name: "rootServer", owner: 0, users: [0], messages: [{ umid: 0, user: 0, date: 1665776198931, content: "Hello World!"}] });