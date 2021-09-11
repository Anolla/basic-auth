"use strict";

const usersModel = require("../models/usersModel");
const ticketsModel = require("../models/ticketsModel");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(process.env.DATABASE_URL,{});

const users = usersModel(sequelize, DataTypes);
const tickets = ticketsModel(sequelize, DataTypes);

users.hasMany(tickets, { foreignKey: 'userId', sourceKey: 'id'});
tickets.belongsTo(users, { foreignKey: 'userId', targetKey: 'id'});

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
