import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Payment = sequelize.define('Payment', {
  paymentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  feeID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  studentID: { 
    type: DataTypes.INTEGER, 
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
