  import { DataTypes } from 'sequelize';
  import sequelize from '../../config/database.js';

  const Enrollment = sequelize.define('Enrollment', {
    enrollmentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    
    studentID: {
      type: DataTypes.INTEGER,
      allowNull: true, // Change from false to true
      references: { model: 'Students', key: 'studentID' },
      onDelete: 'SET NULL',
    },

    courseID: {
      type: DataTypes.INTEGER,
      allowNull: true, // Change from false to true
      references: { model: 'Courses', key: 'courseID' },
      onDelete: 'SET NULL',
    },

    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },

    status: {
      type: DataTypes.ENUM('Enrolled', 'Dropped', 'Completed', 'Failed'),
      allowNull: false,
      defaultValue: 'Enrolled',
    },

    grade: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },

  }, {
    timestamps: false,
    paranoid: true, // Enables soft delete
  });


  export default Enrollment;
