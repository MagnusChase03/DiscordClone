#!/bin/bash

if [[ "$TYPE" == "primary" ]]; then
  sleep 5
  mongosh -u $USER -p $PASSWD --eval repl.js 
fi
