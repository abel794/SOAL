require('dotenv').config(); // para leer variables de Render

const sequelize = new Sequelize(
  process.env.DB_NAME,     // tu base de datos en PlanetScale
  process.env.DB_USER,     // usuario del branch
  process.env.DB_PASSWORD, // contraseña del branch
  {
    host: process.env.DB_HOST,  // host de PlanetScale
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true // obligatorio en PlanetScale
      }
    },
    logging: false
  }
);
