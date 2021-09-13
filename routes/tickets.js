const express = require("express");
const ticketsRouter = express.Router();
// const basicAuth = require("../middlewares/auth/basicAuth");
const bearerAuth = require("../middlewares/auth/bearerAuth");
const acl = require("../middlewares/auth/acl");

const usersModel = require("../models/usersModel");
const ticketsModel = require("../models/ticketsModel");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL);

const users = usersModel(sequelize, DataTypes);
const tickets = ticketsModel(sequelize, DataTypes);

const { Ticket } = require("../models/index");

//TODO get my tickets
ticketsRouter.get(
  "/myTickets",
  bearerAuth(users),
  acl("create"),
  async (req, res) => {
    const username = req.user.username;
    let theRecord = await Ticket.getByName(username);
    if (theRecord.length>0) res.status(200).json(theRecord);
    else {
      res.status(404).send("this user has no tickets");
    }
  }
);



ticketsRouter.get(
  "/ticket/:id?",
  bearerAuth(users),
  acl("create"),
  async (req, res) => {
    const id = req.params.id;
    let theRecord = await Ticket.get(id);
    res.status(200).json(theRecord);
  }
);

ticketsRouter.post(
  "/createTicket",
  bearerAuth(users),
  acl("create"),
  async (req, res) => {
    console.log("create access permitted");
    req.body.userId = req.user.id; //taken from the token
    req.body.username = req.user.username;
    console.log(req.user, "req.body");
    let createdTicket = await Ticket.create(req.body);

    res.status(201).send(createdTicket);
  }
);

ticketsRouter.put(
  "/update/:id",
  bearerAuth(users),
  acl("update"),
  async (req, res) => {
    console.log("update access permitted");
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await Ticket.update(id, obj);
    res.status(200).json(updatedRecord);
  }
);

ticketsRouter.delete(
  "/delete/:id",
  bearerAuth(users),
  acl("delete"),
  async (req, res) => {
    console.log("delete access permitted");
    let id = req.params.id;
    let deletedRecord = await Ticket.delete(id);
    res.status(200).json(deletedRecord);
  }
);

module.exports = ticketsRouter;
