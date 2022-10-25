db = new Mongo().getDB("admin")

db.createUser({ user: USER, pwd: PASSWD, roles: [{ role: "userAdminAnyDatabase", db: "admin" },{ role: "readWriteAnyDatabase", db: "admin" }]})
