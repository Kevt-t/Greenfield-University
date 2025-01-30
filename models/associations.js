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
  /** ========================
   *  Majors and Minors Association
   *  ========================= */
  Major.hasMany(Student, { foreignKey: 'majorID', as: 'students' });
  Student.belongsTo(Major, { foreignKey: 'majorID', as: 'major' });

  Minor.hasMany(Student, { foreignKey: 'minorID', as: 'students' });
  Student.belongsTo(Minor, { foreignKey: 'minorID', as: 'minor' });

  /** ========================
   *  Instructor and Courses Association
   *  ========================= */
  Instructor.hasMany(Course, { foreignKey: 'instructorID', as: 'courses' });
  Course.belongsTo(Instructor, { foreignKey: 'instructorID', as: 'instructor' });

  /** ========================
   *  Many-to-Many: Students & Courses via Enrollment
   *  ========================= */
  Student.belongsToMany(Course, { through: Enrollment, foreignKey: 'studentID', as: 'courses' });
  Course.belongsToMany(Student, { through: Enrollment, foreignKey: 'courseID', as: 'students' });

  // Ensure enrollment has direct links to Student and Course
  Enrollment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
  Enrollment.belongsTo(Course, { foreignKey: 'courseID', as: 'course' });

  Student.hasMany(Enrollment, { foreignKey: 'studentID', as: 'enrollments' });
  Course.hasMany(Enrollment, { foreignKey: 'courseID', as: 'enrollments' });

  /** ========================
   *  Fees and Payments Association
   *  ========================= */
  Fee.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
  Student.hasMany(Fee, { foreignKey: 'studentID', as: 'fees' });

  Payment.belongsTo(Fee, { foreignKey: 'feeID', as: 'fee' });
  Fee.hasMany(Payment, { foreignKey: 'feeID', as: 'payments' });

  Payment.belongsTo(Student, { foreignKey: 'studentID', as: 'student' });
  Student.hasMany(Payment, { foreignKey: 'studentID', as: 'payments' });

  console.log('✅ Associations have been set up successfully!');
};

export default setupAssociations;
