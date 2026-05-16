// config/database.js
const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sql'),
    logging: false // Toggle to console.log to see raw SQL queries
});

module.exports = sequelize;