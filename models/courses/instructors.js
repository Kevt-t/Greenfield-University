import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../../config/database.js'; // Import the sequelize instance configured for the database

const Instructor = sequelize.define('Instructor', {
    instructorID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[+\d\s-]+$/, // Supports country codes and separators
      },
    },
  
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt`
  });
  
export default Instructor;
  