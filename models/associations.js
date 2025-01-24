import { DataTypes } from 'sequelize'; // Import DataTypes from sequelize for defining model attributes
import sequelize from '../config/db.js'; // Import the sequelize instance configured for the database
import Student from './student.js';
import Major from './student/majors.js';
import Minor from './student/minors.js';
import Course from './courses/courses.js';
import Instructor from './courses/instructors.js';
import Enrollment from './courses/enrollment.js';

// Students
Student.belongsTo(Major, { foreignKey: 'majorID', as: 'major' });
Student.belongsTo(Minor, { foreignKey: 'minorID', as: 'minor' });
Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentID', as: 'courses' });

// Majors and Minors
Major.hasMany(Student, { foreignKey: 'majorID', as: 'students' });
Minor.hasMany(Student, { foreignKey: 'minorID', as: 'students' });

// Courses
Course.belongsTo(Instructor, { foreignKey: 'instructorID', as: 'instructor' });
Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseID', as: 'students' });

// Instructors
Instructor.hasMany(Course, { foreignKey: 'instructorID', as: 'courses' });

// Enrollments
Enrollment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
Enrollment.belongsTo(Course, { foreignKey: 'courseID', as: 'course' });

export default {}; // Optional: Exporting an empty object just to align with ES6 module syntax
