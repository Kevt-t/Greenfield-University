import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../config/db.js'; // Import the sequelize instance configured for the database

const Course = sequelize.define('Course', {
    courseID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 100],
      },
    },
  
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 10,
      },
    },
  
    schedule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    instructorID: {
      type: DataTypes.INTEGER,
      references: {
        model: Instructor, // References the Instructor model
        key: 'instructorID',
      },
      allowNull: false, // A course must have an instructor
    },
  },
  {
    timestamps: true,
  });
  
  export default Course;
  