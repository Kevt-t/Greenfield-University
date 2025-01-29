import sequelize from './config/database.js'; // Your configured Sequelize instance
import setupAssociations from './models/associations.js'; // Import the associations setup function
import {
  Student,
  Major,
  Minor,
  Course,
  Instructor,
  Fee,
  Payment,
  Enrollment
} from './models/index.js'; // Import models

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');

    // Set up associations before syncing
    setupAssociations();

    // Sync database: Recreate all tables and ensure associations are applied
    await sequelize.sync({ force: true });
    console.log('✅ Database synced successfully.');

    // ✅ Seed majors
    const majors = await Major.bulkCreate([
      { majorName: 'Computer Science', type: 'Bachelors', description: 'Study of computers and algorithms.', duration: 4 },
      { majorName: 'Business Administration', type: 'Masters', description: 'Focus on business management.', duration: 2 },
      { majorName: 'Mechanical Engineering', type: 'Bachelors', description: 'Study of mechanical systems and design.', duration: 4 },
      { majorName: 'Psychology', type: 'Bachelors', description: 'Study of human behavior and mental processes.', duration: 4 },
      { majorName: 'Biology', type: 'Bachelors', description: 'Study of living organisms and ecosystems.', duration: 4 },
    ], { returning: true });

    console.log(`✅ Seeded ${majors.length} majors.`);

    // ✅ Seed minors
    const minors = await Minor.bulkCreate([
      { minorName: 'Mathematics', description: 'Study of numbers and formulas.', duration: 2 },
      { minorName: 'Philosophy', description: 'Study of fundamental questions of existence.', duration: 2 },
      { minorName: 'Psychology', description: 'Study of human behavior and mental processes.', duration: 2 },
    ], { returning: true });

    console.log(`✅ Seeded ${minors.length} minors.`);

    // ✅ Seed instructors
    const instructors = await Instructor.bulkCreate([
      { firstName: 'John', lastName: 'Doe', email: 'jdoe@example.com', phoneNumber: '+123456789', department: 'Computer Science' },
      { firstName: 'Jane', lastName: 'Smith', email: 'jsmith@example.com', phoneNumber: '+987654321', department: 'Business' },
    ], { returning: true });

    console.log(`✅ Seeded ${instructors.length} instructors.`);

    // ✅ Seed courses
    const courses = await Course.bulkCreate([
      { courseName: 'Introduction to Programming', description: 'Learn the basics of programming.', credits: 3, schedule: 'Mon 10:00-12:00', instructorID: instructors[0].instructorID },
      { courseName: 'Marketing 101', description: 'Introduction to marketing principles.', credits: 3, schedule: 'Wed 14:00-16:00', instructorID: instructors[1].instructorID },
    ], { returning: true });

    console.log(`✅ Seeded ${courses.length} courses.`);

    // ✅ Seed students
    const students = await Student.bulkCreate([
      { firstName: 'Alice', lastName: 'Johnson', DOB: '2000-05-15', gender: 'Female', email: '7457492@philasd.org', phoneNumber: '1234567890', address: '123 Main St', majorID: majors[0].majorID, enrollmentDate: '2023-01-15' },
      { firstName: 'Bob', lastName: 'Williams', DOB: '1999-10-20', gender: 'Male', email: 'bob@example.com', phoneNumber: '0987654321', address: '456 Elm St', majorID: majors[1].majorID, minorID: minors[0].minorID, enrollmentDate: '2023-01-15' },
    ], { returning: true });

    if (!students.length) {
      throw new Error("❌ No students were inserted! Check seeding process.");
    }

    console.log(`✅ Seeded ${students.length} students.`);

    // ✅ Seed enrollments
    const enrollments = await Enrollment.bulkCreate([
      { studentID: students[0].studentID, courseID: courses[0].courseID, enrollmentDate: '2023-01-16', grade: 90 },
      { studentID: students[1].studentID, courseID: courses[1].courseID, enrollmentDate: '2023-01-16', grade: 85 },
    ], { returning: true });

    console.log(`✅ Seeded ${enrollments.length} enrollments.`);

    // ✅ Seed fees
    const fees = await Fee.bulkCreate([
      { studentID: students[0].studentID, amount: 5000, description: 'Tuition Fee', dueDate: '2023-02-01', status: 'Pending' },
      { studentID: students[1].studentID, amount: 7000, description: 'Tuition Fee', dueDate: '2023-02-01', status: 'Pending' },
    ], { returning: true });

    console.log(`✅ Seeded ${fees.length} fees.`);

    // ✅ Seed payments
    const payments = await Payment.bulkCreate([
      { feeID: fees[0].feeID, studentID: students[0].studentID, paymentDate: '2023-01-20', amount: 5000, method: 'Credit Card', referenceNumber: 'REF12345' },
      { feeID: fees[1].feeID, studentID: students[1].studentID, paymentDate: '2023-01-25', amount: 7000, method: 'Bank Transfer', referenceNumber: 'REF67890' },
    ], { returning: true });

    console.log(`✅ Seeded ${payments.length} payments.`);

    console.log('🎉 Database successfully seeded with sample data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
    console.log('🔴 Database connection closed.');
  }
};

// Run the seeding process
seedDatabase();
