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
    allowNull: true,  // ✅ Now allows NULL when Fee is deleted
    references: { model: 'Fees', key: 'feeID' },
    onDelete: 'SET NULL',
},


  studentID: {
    type: DataTypes.INTEGER,
    references: { model: 'Students', key: 'studentID' },
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
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [['Credit Card', 'Bank Transfer', 'Check']] },
  },

  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  status: {
    type: DataTypes.ENUM('Pending', 'Failed', 'Successful'), // ✅ Use ENUM instead of STRING + validation
    allowNull: false,
    defaultValue: 'Pending',
  },  
}, {
  paranoid: true, // Enables soft delete
});


export default Payment;
