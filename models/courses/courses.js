  import { DataTypes } from 'sequelize';
  import sequelize from '../../config/database.js';

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
      allowNull: false,
      references: { model: 'Instructors', key: 'instructorID' }, 
    },  
  }, {
    timestamps: true,
  });

  export default Course;
