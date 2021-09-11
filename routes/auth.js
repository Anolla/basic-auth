"use strict";

const express = require("express");
const authRouter = express.Router();
const basicAuth = require("../middlewares/auth/basicAuth");
const bearerAuth = require("../middlewares/auth/bearerAuth");
const acl = require("../middlewares/auth/acl");
const usersModel = require("../models/usersModel");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);
const users = usersModel(sequelize, DataTypes);

const DataCollection = require("../models/dataCollection");
const UsersCollection = new DataCollection(users);

authRouter.get("/users", bearerAuth(users), async (req, res) => {
  const allUsers = await users.findAll();
  const list = allUsers.map((user) => user.username);
  res.status(200).send(list);
});

// create a new user
authRouter.post("/signup", (req, res) => {
  users
    .create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => res.status(400).send(err));
});

// sign in
authRouter.post("/signin", basicAuth(users), (req, res) => {
  // the user will have the user info and the token
  res.status(200).send(req.user);
});

authRouter.get(
  "/user/:id",
  bearerAuth(users),
  acl("create"),
  async (req, res) => {
    const id = req.params.id;
    let theRecord = await UsersCollection.get(id)
    res.status(200).json(theRecord);
  }
);

authRouter.post(
  "/create",
  bearerAuth(users),
  acl("create"),
  async (req, res) => {
    console.log("create access permitted");
    let createdUser = await UsersCollection.create(req.body);
    res.status(201).send(createdUser);
  }
);

authRouter.put(
  "/update/:id",
  bearerAuth(users),
  acl("update"),
  async (req, res) => {
    console.log("update access permitted");
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await UsersCollection.update(id, obj);
    res.status(200).json(updatedRecord);
  }
);

authRouter.delete(
  "/delete/:id",
  bearerAuth(users),
  acl("delete"),
  async (req, res) => {
    console.log("delete access permitted");
    let id = req.params.id;
    let deletedRecord = await UsersCollection.delete(id);
    res.status(200).json(deletedRecord);
  }
);

module.exports = authRouter;
