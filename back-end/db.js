const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('soal', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

