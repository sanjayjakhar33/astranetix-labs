const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Invoice = sequelize.define('Invoice', {
  clientName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientCompany: {
    type: DataTypes.STRING,
    allowNull: true
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  gst: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  grandTotal: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Invoice;
