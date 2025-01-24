import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../config/db.js'; // Import the sequelize instance configured for the database

const Payment = sequelize.define('Payment', {
  paymentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  feeID: {
    type: DataTypes.INTEGER,
    references: { model: Fee, key: 'feeID' },
    allowNull: false,
  },
  studentID: { 
    type: DataTypes.INTEGER, 
    references: { model: Student, key: 'studentID' },
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  method: {
    type: DataTypes.ENUM('Credit Card', 'Bank Transfer', 'Check'),
    allowNull: false,
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Optional but useful for reconciliation
  },
});

export default Payment;