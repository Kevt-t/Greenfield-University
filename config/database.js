import { Sequelize } from 'sequelize';
import 'dotenv/config';

console.log('Connecting to database...');

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'mysql', 
    logging: true, 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, 
      idle: 10000,
    },
  }
);

// Authenticate and synchronize the database
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Sync models to the database
    await sequelize.sync({ force: false }); // Adjust options as needed
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or synchronize:', error);
  }
})();

export default sequelize;