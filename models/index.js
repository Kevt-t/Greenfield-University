import sequelize from '../config/database.js';
import seedDatabase from '../seed.js';

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

// Set up associations BEFORE syncing
setupAssociations();

// Synchronize database and seed it afterward
const syncDatabase = async (force = true) => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established.');

    // Sync the database with the provided force option
    await sequelize.sync({ force });

    console.log(
      force
        ? '⚠️ Database has been reset and synchronized (force: true).'
        : '✅ Database has been synchronized without resetting (force: false).'
    );

    // Seed database only after sync is done
    await seedDatabase();

  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

// ✅ Call sync function with force=false
syncDatabase();

export { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment };
