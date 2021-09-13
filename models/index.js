"use strict";

const usersModel = require("../models/usersModel");
const ticketsModel = require("../models/ticketsModel");
const { Sequelize, DataTypes } = require("sequelize");
// const sequelize = new Sequelize(process.env.DATABASE_URL,{});
let POSTGRES_URI =
  "postgres://tufgjpdd:U08gtU2ndhXLxps47GogqHXEChatzc91@chunee.db.elephantsql.com/tufgjpdd";
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
