import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../config/database.js'; // Import the sequelize instance configured for the database
import { Student, 
    Major, 
    Minor, 
    Course, 
    Instructor, 
    Enrollment, 
    Fee, 
    Payment } 
from './index.js';

// Students
Student.belongsTo(Major, { foreignKey: 'majorID', as: 'major' });
Student.belongsTo(Minor, { foreignKey: 'minorID', as: 'minor' });

Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentID', as: 'courses' });

Student.hasMany(Fee, { foreignKey: 'studentID', as: 'fees' });
Student.hasMany(Payment, { foreignKey: 'studentID', as: 'payments' });

// Majors and Minors
Major.hasMany(Student, { foreignKey: 'majorID', as: 'students' });
Minor.hasMany(Student, { foreignKey: 'minorID', as: 'students' });

// Courses
Course.belongsTo(Instructor, { foreignKey: 'instructorID', as: 'instructor' });
Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseID', as: 'students' });
Instructor.hasMany(Course, { foreignKey: 'instructorID', as: 'courses' });

// Enrollments
Enrollment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseID', as: 'course' });

// Fees and Payments
Fee.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
Fee.hasMany(Payment, { foreignKey: 'feeID', as: 'payments' });
Payment.belongsTo(Fee, { foreignKey: 'feeID', as: 'fee' });
Payment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });

export default {}; // Optional: Keeps associations.js valid as a module
