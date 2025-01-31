import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import bcrypt from 'bcrypt';

const Instructor = sequelize.define('Instructor', {
    instructorID: {
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

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },

    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: { is: /^[+\d\s-]+$/ }
    },

    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // New Fields for Activation & Security
    isAccountActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    activationToken: {
        type: DataTypes.STRING,
        allowNull: true
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    requiresPasswordReset: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
}, { paranoid: true }); // Enables soft delete

// Hash password before saving
Instructor.beforeCreate(async (instructor) => {
    if (instructor.password) {
        const salt = await bcrypt.genSalt(10);
        instructor.password = await bcrypt.hash(instructor.password, salt);
    }
});

// Hash password before updating
Instructor.beforeUpdate(async (instructor) => {
    if (instructor.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        instructor.password = await bcrypt.hash(instructor.password, salt);
    }
});

export default Instructor;