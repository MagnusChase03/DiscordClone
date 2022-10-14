db = new Mongo().getDB("DiscordClone");

db.users.insertOne({uuid: 0, username: "root", password: "root"});