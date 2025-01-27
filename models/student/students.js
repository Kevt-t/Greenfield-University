import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../../config/database.js'; // Import the sequelize instance configured for the database
import Major from './majors.js';
import Minor from './minors.js';
import Instructor from '../courses/instructors.js';
import {} from '../associations.js';
import bcrypt from 'bcrypt'; // Import bcrypt for password hashing

const Student = sequelize.define('Student', {

    studentID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

    firstName: {
        type:DataTypes.STRING,
        allowNull: false,
    },

    lastName: {
        type:DataTypes.STRING,
        allowNull: false,
    },

    DOB: {
        type:DataTypes.DATEONLY,
        allowNull:false,
    },

    gender: {
        type: DataTypes.ENUM('Male','Female','Non-Binary','Other'),
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9]+$/, // Regular expression for numbers only
        },
      },

      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      enrollmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },

      status: {
        type: DataTypes.ENUM('Active', 'Graduated', 'Withdrawn','Banned'),
        allowNull: false,
        defaultValue: 'Active',
      },

      majorID: {
        type: DataTypes.INTEGER,
        references: {
            model: Major, // Reference to Major model
            key: 'majorID',
        },
        allowNull: false, // A student must have a major
    },
    
    minorID: {
        type: DataTypes.INTEGER,
        references: {
            model: Minor, // Reference to Minor model
            key: 'minorID',
        },
        allowNull: true, // Minor is optional
    },
    
    isAccountActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Accounts are inactive by default
    },

    });

export default Student;
