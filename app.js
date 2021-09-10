"use strict";

const express = require("express");
const bccrypt = require("bcrypt");
const base64 = require("base-64");
const { Sequelize, DataTypes } = require("sequelize");

// prepare the express app
const app = express();
app.use(express.json());

// creating cloud postgres on Heroku and connecting it with my application
let POSTGRES_URI ="postgres://uojrxlrtiakavk:bba5fe630a52eef60ea1a6557726df1bab5842369d9f165a91eab3d787970ab1@ec2-54-217-15-9.eu-west-1.compute.amazonaws.com:5432/d151m6s2avllim";
//POSTGRES_URI from Config Vars on Heroku
let sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
let sequelize = new Sequelize(POSTGRES_URI, sequelizeOptions);

// const sequelize = new Sequelize("postgres://tufgjpdd:U08gtU2ndhXLxps47GogqHXEChatzc91@chunee.db.elephantsql.com/tufgjpdd");

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
  console.log(user, "user"); // what might we want to do programmiaticall before user data is presisted to the database?
});

// create a new user
app.post("/signup", async (req, res) => {
  //1- get user info from the request.
  let authHeader = req.headers.authorization;
  // ['Basic username:password']
  console.log(authHeader, "authHeader");

  // let encodedCreditentials = authHeader.split(' ')[1];
  let encodedCreditentials = authHeader.split(" ").pop();

  let decodedCreditentials = base64.decode(encodedCreditentials);
  // username:password
  console.log(decodedCreditentials, "decodedCreditentials");

  let [username, password] = decodedCreditentials.split(":");

  //2- check if the user already exists
  const user = await Users.findOne({ where: { username } });
  if (user) {
    res.json({ error: "User already exists" });
  } else {
    //3- encrypt password
    let hashedPassword = await bccrypt.hash(password, 10);

    //4- create user
    const record = await Users.create({ username, password: hashedPassword });
    res.status(201).json(record);
  }
});

// sign in
app.post("/signin", async (req, res) => {
  //1- get user the credentials from the request.
  let authHeader = req.headers.authorization;
  // ['Basic username:password']
  console.log(authHeader, "authHeader");

  // let encodedCreditentials = authHeader.split(' ')[1];
  let encodedCreditentials = authHeader.split(" ").pop();

  let decodedCreditentials = base64.decode(encodedCreditentials);
  // username:password
  console.log(decodedCreditentials, "decodedCreditentials");

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
    app.listen(3030, () => console.log("server is up on port 3030"));
  })
  .catch((err) => console.log(err));
