from ubuntu:focal 

run apt update -y
run apt install -y wget
run apt install -y gnupg
run apt install -y psmisc

run wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
run echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list

run apt update -y
run apt install mongodb-org -y

run mkdir -p /data/db

copy init.sh .
run bash init.sh

cmd mongod
