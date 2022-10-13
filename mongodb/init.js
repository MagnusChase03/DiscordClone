db = new Mongo().getDB("DiscordClone");

db.test.insertOne({x: 1});