import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

const Student = sequelize.define('Student', {
  studentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
 
  firstName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  lastName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  DOB: { 
    type: DataTypes.DATEONLY, 
    allowNull: false 
  },

  gender: { 
    type: DataTypes.ENUM('Male', 'Female', 'Non-Binary', 'Other'), 
    allowNull: false
  },

  email: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    unique: true, validate: { isEmail: true } 
  },

  phoneNumber: { 
    type: DataTypes.STRING, 
    allowNull: true, 
    validate: { is: /^[0-9]+$/ } 
  },
  
  address: { 
    type: DataTypes.TEXT, 
    allowNull: true 
  },
  
  enrollmentDate: {
    type: DataTypes.DATEONLY, 
    allowNull: false, 
    defaultValue: DataTypes.NOW 
  },

  status: { 
    type: DataTypes.ENUM('Active', 'Graduated', 'Withdrawn', 'Banned'), 
    allowNull: false, 
    defaultValue: 'Active' 
  },

  majorID: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  minorID: {
    type: DataTypes.INTEGER,
    allowNull: true 
  },

  isAccountActive: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
    
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
});
 
export default Student;
