"use strict";

const server = require("./src/server");

const { db } = require("./models/index");

db.sync()
  .then(() => {
    server.start(3004);
  })
  .catch((err) => console.log(err));
