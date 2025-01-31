import sequelize from './config/database.js';
import { Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment } from './models/index.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // **Clear existing data (Optional: if using sync({ force: true }))**
    await sequelize.sync({ force: true });

    /** =======================
     *  Seed Majors & Minors
     *  ======================= */
    const majors = await Major.bulkCreate([
      { majorName: 'Computer Science', type: 'Bachelors', duration: 4 },
      { majorName: 'Business Administration', type: 'Bachelors', duration: 4 },
      { majorName: 'Mechanical Engineering', type: 'Bachelors', duration: 4 }
    ]);

    const minors = await Minor.bulkCreate([
      { minorName: 'Mathematics', duration: 2 },
      { minorName: 'Psychology', duration: 2 }
    ]);

    /** =======================
     *  Seed Instructors
     *  ======================= */
    const hashedInstructorPassword = await bcrypt.hash('instructor123', 10);
    const instructors = await Instructor.bulkCreate([
      { firstName: 'Jose', lastName: 'Torres', email: '7457492@philasd.org', department: 'Computer Science', password: hashedInstructorPassword, isAccountActive: false },
      { firstName: 'Bob', lastName: 'Smith', email: 'bob@university.edu', department: 'Business', password: hashedInstructorPassword, isAccountActive: false }
    ]);

    /** =======================
     *  Seed Courses
     *  ======================= */
    const courses = await Course.bulkCreate([
      { courseName: 'Introduction to Programming', description: 'Learn the basics of programming.', credits: 3, schedule: 'MWF 9:00-10:30', instructorID: instructors[0].instructorID },
      { courseName: 'Marketing Strategies', description: 'Fundamentals of marketing.', credits: 3, schedule: 'TTh 11:00-12:30', instructorID: instructors[1].instructorID }
    ]);

    /** =======================
     *  Seed Students
     *  ======================= */
    const hashedStudentPassword = await bcrypt.hash('student123', 10);
    const students = await Student.bulkCreate([
      { firstName: 'Kevin', lastName: 'Tellez-Torres', email: 'kevintelleztorres@gmail.com', DOB: '2000-05-15', gender: 'Male', majorID: majors[0].majorID, minorID: minors[0].minorID, password: hashedStudentPassword, isAccountActive: false },
      { firstName: 'Emily', lastName: 'Clark', email: 'emily.clark@example.com', DOB: '2001-07-22', gender: 'Female', majorID: majors[1].majorID, minorID: minors[1].minorID, password: hashedStudentPassword, isAccountActive: false }
    ]);

    /** =======================
     *  Seed Enrollments
     *  ======================= */
    await Enrollment.bulkCreate([
      { studentID: students[0].studentID, courseID: courses[0].courseID },
      { studentID: students[1].studentID, courseID: courses[1].courseID }
    ]);

    /** =======================
     *  Seed Fees
     *  ======================= */
    const fees = await Fee.bulkCreate([
      { studentID: students[0].studentID, amount: 5000, description: 'Tuition Fee', dueDate: '2025-01-10', status: 'Pending' },
      { studentID: students[1].studentID, amount: 4800, description: 'Tuition Fee', dueDate: '2025-01-10', status: 'Paid' }
    ]);

    /** =======================
     *  Seed Payments
     *  ======================= */
    await Payment.bulkCreate([
      { feeID: fees[1].feeID, studentID: students[1].studentID, amount: 4800, paymentDate: '2025-01-05', method: 'Credit Card', status: 'Successful' }
    ]);

    console.log('✅ Database successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seed script
seedDatabase();
