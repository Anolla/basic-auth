"use strict";

const usersModel = require("../models/usersModel");
const ticketsModel = require("../models/ticketsModel");
const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize(process.env.DATABASE_URL,{});
let DATABASE_URL =
  "postgres://uojrxlrtiakavk:bba5fe630a52eef60ea1a6557726df1bab5842369d9f165a91eab3d787970ab1@ec2-54-217-15-9.eu-west-1.compute.amazonaws.com:5432/d151m6s2avllim";
//POSTGRES_URI from Config Vars on Heroku
// let sequelizeOptions = {
//   dialect: "postgres",
//   protocol: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
// };
let sequelizeOptions = {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
};
let sequelize = new Sequelize(DATABASE_URL, sequelizeOptions);

const users = usersModel(sequelize, DataTypes);
const tickets = ticketsModel(sequelize, DataTypes);

users.hasMany(tickets, { foreignKey: "userId", sourceKey: "id" });
tickets.belongsTo(users, { foreignKey: "userId", targetKey: "id" });

// customerModel.hasMany(orderModel, { foreignKey: 'customerId', sourceKey: 'id'});
// orderModel.belongsTo(customerModel, { foreignKey: 'customerId', targetKey: 'id'});

const DataCollection = require("../models/dataCollection");
const UsersCollection = new DataCollection(users);
const TicketsCollection = new DataCollection(tickets);

module.exports = {
  db: sequelize,
  User: UsersCollection,
  Ticket: TicketsCollection,
};
