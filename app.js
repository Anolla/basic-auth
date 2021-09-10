"use strict";

const express = require("express");
const bccrypt = require("bcrypt");
const base64 = require("base-64");
const { Sequelize, DataTypes } = require("sequelize");

// prepare the express app
const app = express();
app.use(express.json());

const sequelize = new Sequelize("postgres://tufgjpdd:U08gtU2ndhXLxps47GogqHXEChatzc91@chunee.db.elephantsql.com/tufgjpdd");

const Users = sequelize.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// perform a functionallity before we create and save a new user
Users.beforeCreate((user) => {
  console.log(user,'user'); // what might we want to do programmiaticall before user data is presisted to the database?

  // hash the password
});

// create a new user
app.post("/signup", async (req, res) => {
  //1- get user info from the request.
  let authHeader = req.headers.authorization;
  // ['Basic username:password']
  console.log(authHeader,'authHeader');

  // let encodedCreditentials = authHeader.split(' ')[1];
  let encodedCreditentials = authHeader.split(" ").pop();

  let decodedCreditentials = base64.decode(encodedCreditentials);
  // username:password
  console.log(decodedCreditentials,'decodedCreditentials');

  let [username, password] = decodedCreditentials.split(":");

  //2- TODO: check if the user already exists

  //3- encrypt password
  let hashedPassword = await bccrypt.hash(password, 10);

  //4- create user
  const record = await Users.create({ username, password: hashedPassword });
  res.status(201).json(record);
});

// sign in
app.post("/signin", async (req, res) => {
  /*
   * firs we need to get the credentials from the request
   */

  //1- get user info from the request.
  let authHeader = req.headers.authorization;
  // ['Basic username:password']
  console.log(authHeader,'authHeader');

  // let encodedCreditentials = authHeader.split(' ')[1];
  let encodedCreditentials = authHeader.split(" ").pop();

  let decodedCreditentials = base64.decode(encodedCreditentials);
  // username:password
  console.log(decodedCreditentials,'decodedCreditentials');

  let [username, password] = decodedCreditentials.split(":");

  // get the user from the database
  const user = await Users.findOne({ where: { username } });
  // compare the password, to make sure that the user is the one that is trying to sign in
  const isValid = await bccrypt.compare(password, user.password);

  if (isValid) {
    // success
    res.status(200).json(user);
  } else {
    // unauthenticated
    res.status(401).json({ error: "Invalid credentials" });
  }
});

sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => console.log("server is up on port 3000"));
  })
  .catch((err) => console.log(err));
