import sequelize from '../config/database.js';

// Import Models
import Major from './student/majors.js';
import Minor from './student/minors.js';
import Student from './student/students.js';
import Course from './courses/courses.js';
import Instructor from './courses/instructors.js';
import Enrollment from './courses/enrollments.js';
import Fee from './finance/fees.js';
import Payment from './finance/payments.js';

// Import and Apply Associations
import setupAssociations from './associations.js';

// ✅ Set up associations BEFORE syncing
setupAssociations();

// ✅ Synchronize database (using force: true)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // ⚠️ WARNING: This will DROP ALL TABLES and recreate them
    await sequelize.sync({ force: false });
    console.log('⚠️ Database has been reset and synchronized (force: true).');

  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

// ✅ Call sync function
syncDatabase();

export { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment };
