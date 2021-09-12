"use strict";

const tickets = (sequelize, DataTypes) =>
  sequelize.define("tickets", {
    username: { type: DataTypes.STRING, required: true },
    type: {
      type: DataTypes.ENUM("feedback", "suggestions", "report"),
      required: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "open",
    },
  });

module.exports = tickets;
