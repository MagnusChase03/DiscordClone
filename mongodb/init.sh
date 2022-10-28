#!/bin/bash

mongod &

sleep 5
mongosh --eval "var USER = '$USER'; var PASSWD = '$PASSWD'" init.js

sleep 2

killall mongod

sleep 2

bash repl.sh &
mongod --replSet "rs0" --bind_ip localhost,$NAME
