#!/bin/bash

mongod &

mongosh --eval "use admin; db.createUser({ user: "$USER", pwd: "$PASSWD" roles: [{ role: "userAdminAnyDatabase", db: "admin" },{ role: "readWriteAnyDatabase", db: "admin" }]})"

killall mongod
