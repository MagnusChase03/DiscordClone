const express = require('express');
const cors = require('cors');
const db = require('./db/conn');

const app = express()
const port = 3000

app.use(cors());
app.use(express.urlencoded({extended: true}));

const userRoutes = require('./routes/user');
app.use('/user', userRoutes);

const serverRoutes = require('./routes/server');
app.use('/server', serverRoutes);

app.listen(port, async () => {

    await db.connect();
    console.log(`Example app listening on port ${port}`);

});