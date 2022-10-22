const redis = require('redis');

var client;

module.exports = {

    connect: () => {

        client = redis.createClient({

            socket: {

                host: 'redis',
                port: 6379

            }

        });


    },

    getRedis: () => {

        return client;

    }

};
