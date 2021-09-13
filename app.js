"use strict";

const server = require("./src/server");

const { db } = require("./models/index");

db.sync()
  .then(() => {
    server.start(process.env.PORT || 8080);
  })
  .catch((err) => console.log(err));
