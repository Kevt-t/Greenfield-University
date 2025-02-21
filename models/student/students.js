import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import bcrypt from 'bcrypt';

const Student = sequelize.define('Student', {
  studentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
    unique: true, // Ensure it's indexed properly
  },
  
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DOB: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [['Male', 'Female', 'Non-Binary', 'Other']] },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: { is: /^[0-9]+$/ },
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  enrollmentDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Active',
    validate: { isIn: [['Active', 'Graduated', 'Withdrawn', 'Banned']] },
  },
  majorID: {
    type: DataTypes.INTEGER,
    allowNull: true, //  Now allows students to exist without a major
    references: { model: 'Majors', key: 'majorID' },
    onDelete: 'SET NULL',  // Keeps student record if major is deleted
    onUpdate: 'CASCADE'
  },
  minorID: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'Minors', key: 'minorID' },
    onDelete: 'SET NULL',  // Keeps student record if minor is deleted
    onUpdate: 'CASCADE'
  },
  isAccountActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  activationToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  requiresPasswordReset: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  deletedAt: {
    type: DataTypes.DATE,
  }, // Enables soft delete
}, {
  paranoid: true,
}); 

// Hash password before saving
Student.beforeCreate(async (student) => {
  if (student.password && !student.password.startsWith("$2b$")) { // Prevent rehashing
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(student.password, salt);
  }
});

// Hash password before updating
Student.beforeUpdate(async (student) => {
  if (student.changed("password") && !student.password.startsWith("$2b$")) { // Prevent rehashing
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(student.password, salt);
  }
});

export default Student;