'use strict';

const ticketModel = (sequelize, DataTypes) => sequelize.define('Tickets', {
  name: { type: DataTypes.STRING, required: true },
  type: { type: DataTypes.ENUM('feedback', 'suggestions', 'report'), required: true }
});

module.exports = ticketModel;