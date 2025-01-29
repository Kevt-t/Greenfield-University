import sequelize from '../config/database.js';
import Student from './student/students.js';
import Major from './student/majors.js';
import Minor from './student/minors.js';
import Course from './courses/courses.js';
import Instructor from './courses/instructors.js';
import Enrollment from './courses/enrollment.js';
import Fee from './finance/fees.js';
import Payment from './finance/payments.js';

const setupAssociations = () => {
  const { Student, Major, Minor, Course, Instructor, Enrollment, Fee, Payment } = sequelize.models;

  // ✅ Ensure Majors & Minors Are Created First
  Major.hasMany(Student, { foreignKey: 'majorID', as: 'students' });
  Minor.hasMany(Student, { foreignKey: 'minorID', as: 'students' });

  // ✅ Then Associate Students
  Student.belongsTo(Major, { foreignKey: 'majorID', as: 'major' });
  Student.belongsTo(Minor, { foreignKey: 'minorID', as: 'minor' });
  Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentID', as: 'courses' });
  Student.hasMany(Fee, { foreignKey: 'studentID', as: 'fees' });
  Student.hasMany(Payment, { foreignKey: 'studentID', as: 'payments' });

  // ✅ Ensure Instructor Is Created Before Course
  Instructor.hasMany(Course, { foreignKey: 'instructorID', as: 'courses' });
  Course.belongsTo(Instructor, { foreignKey: 'instructorID', as: 'instructor' });

  // ✅ Course-Student Many-to-Many Relationship
  Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseID', as: 'students' });

  // ✅ Ensure Enrollments Reference Student & Course
  Enrollment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
  Enrollment.belongsTo(Course, { foreignKey: 'courseID', as: 'course' });
  
  // ✅ Fees and Payments Relationships
  Fee.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
  Fee.hasMany(Payment, { foreignKey: 'feeID', as: 'payments' });
  Payment.belongsTo(Fee, { foreignKey: 'feeID', as: 'fee' });
  Payment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
};

export default setupAssociations;
