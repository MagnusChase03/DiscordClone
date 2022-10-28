db = new Mongo().getDB("admin")


if (db.getUsers().users.length == 0) {

    db.createUser({ user: USER, pwd: PASSWD, roles: [{ role: "userAdminAnyDatabase", db: "admin" },{ role: "readWriteAnyDatabase", db: "admin" }]})

}
