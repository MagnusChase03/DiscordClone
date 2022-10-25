#!/bin/bash

mongod &

sleep 5
mongosh --eval "var USER = '$USER'; var PASSWD = '$PASSWD'" init.js

killall mongod

bash repl.sh &
mongod --replSet "rs0" --bind_ip localhost,$NAME
