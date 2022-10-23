const express = require('express');
const cors = require('cors');
const db = require('./db/conn');
const https = require('https');
const fs = require('fs');

const options = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem')
};

const app = express()
const port = 3000

app.use(cors());
app.use(express.urlencoded({extended: true}));

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const serverRoutes = require('./routes/server');
app.use('/server', serverRoutes);

// app.listen(port, async () => {

//     await db.connect();
//     console.log(`Example app listening on port ${port}`);

// });

var server = https.createServer(options, app)
server.listen(3000, async() => {

    await db.connect();
    console.log("Listening on 3000");

});
