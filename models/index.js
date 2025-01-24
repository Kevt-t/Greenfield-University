import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../config/db.js'; // Import the sequelize instance configured for the database
import Student from './student/students.js';
import Major from './student/majors.js';
import Minor from './student/minors.js';
import Course from './courses/courses.js';
import Instructor from './courses/instructors.js';
import Enrollment from './courses/enrollments.js';
import Fee from './finance/fees.js';
import Payment from './finance/payments.js';

export { default as Student } from './student/students.js';
export { default as Major } from './student/majors.js';
export { default as Minor } from './student/minors.js';
export { default as Course } from './courses/courses.js';
export { default as Instructor } from './courses/instructors.js';
export { default as Enrollment } from './courses/enrollment.js';
export { default as Fee } from './finance/fees.js';
export { default as Payment } from './finance/payments.js';

