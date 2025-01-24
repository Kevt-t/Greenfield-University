// models/index.js
import Student from './student/student.js';
import Major from './student/major.js';
import Minor from './student/minor.js';
import Course from './courses/course.js';
import Instructor from './courses/instructor.js';
import Enrollment from './courses/enrollment.js';
import Fee from './finance/fee.js';
import Payment from './finance/payment.js';

export {
  Student,
  Major,
  Minor,
  Course,
  Instructor,
  Enrollment,
  Fee,
  Payment,
};
