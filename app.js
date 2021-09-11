"use strict";

const express = require("express");
require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const errorHandler = require("./errorHandlers/500.js");
const notFound = require("./errorHandlers/404.js");
const authRoutes = require("./routes/auth.js");
// const v2Routes = require("./routes/v2");

// prepare the express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(authRoutes);
// app.use("/api/v2", v2Routes);


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

sequelize
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 3030, () => console.log(`server is up`));
  })
  .catch((err) => console.log(err));
