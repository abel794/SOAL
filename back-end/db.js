const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('SOAL1', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

