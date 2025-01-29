import sequelize from '../config/database.js';

// Import Models
import Major from './student/majors.js';
import Minor from './student/minors.js';
import Student from './student/students.js';
import Course from './courses/courses.js';
import Instructor from './courses/instructors.js';
import Enrollment from './courses/enrollment.js';
import Fee from './finance/fees.js';
import Payment from './finance/payments.js';
import setupAssociations from './associations.js';



// ✅ Named Exports for Access in Other Files
export { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment };
