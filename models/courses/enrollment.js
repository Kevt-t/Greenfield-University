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
    allowNull: false,
    references: { model: 'Students', key: 'studentID' },
    onDelete: 'CASCADE',
  },
  courseID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Course', key: 'courseID' },
    onDelete: 'CASCADE',
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  grade: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
}, {
  timestamps: false,
});

export default Enrollment;
