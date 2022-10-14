const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://root:root@mongodb:27017/?authSource=admin');

var db;

module.exports = {

    connect: async function() {

        var conn = await client.connect();
        db = conn.db('DiscordClone');
        console.log(db);

    },

    getDB: function() {

        return db;

    }

};