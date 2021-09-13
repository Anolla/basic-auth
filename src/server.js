"use strict";

const express = require("express");
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const errorHandler = require("../errorHandlers/500");
const notFound = require("../errorHandlers/404");
const authRoutes = require("../routes/auth.js");
const ticketsRouter = require("../routes/tickets.js");

// prepare the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
app.use(ticketsRouter);

// creating cloud postgres on Heroku and connecting it with my application
// let POSTGRES_URI =
//   "postgres://tufgjpdd:U08gtU2ndhXLxps47GogqHXEChatzc91@chunee.db.elephantsql.com/tufgjpdd";
// //POSTGRES_URI from Config Vars on Heroku
// let sequelizeOptions = {
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// };
// let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);

// Catchalls
app.use(notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => console.log(`Server is up on port ${port}`));
  },
};
