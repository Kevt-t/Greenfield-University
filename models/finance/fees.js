import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Fee = sequelize.define('Fee', {
  feeID: {
    type: DataTypes.INTEGER,
    autoIncrement: true, // ✅ Ensure auto-increment
    primaryKey: true, // ✅ Ensure it's a primary key
    allowNull: false,
  },

  studentID: {
    type: DataTypes.INTEGER,
    references: { model: 'Students', key: 'studentID' },
    allowNull: false,
  },

  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },

  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
    allowNull: false,
    defaultValue: 'Pending',
  },
});

export default Fee;
