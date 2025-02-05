import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../../config/database.js';

const Minor = sequelize.define('Minor', {
    minorID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  
    minorName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
      },
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true, // Might be optional
      validate: {
          len: [0, 500], // Limits the length of the description
      }},
  
    duration: {
      type: DataTypes.INTEGER, // Duration in years
      allowNull: false,
      validate: {
        min: 1, // At least 1 year for minors
        max: 3, // Minors usually have shorter durations
      },
    },
  },
  {
    timestamps: false,
  });
  
export default Minor;