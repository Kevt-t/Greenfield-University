import sequelize from './config/database.js';
import Student from './models/student/students.js';
import Major from './models/student/majors.js';
import Minor from './models/student/minors.js';
import Instructor from './models/courses/instructors.js';
import Course from './models/courses/courses.js';
import Enrollment from './models/courses/enrollments.js';
import Fee from './models/finance/fees.js';
import Payment from './models/finance/payments.js';

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting data seeding...');

    // Insert Majors & Minors
    const [csMajor, businessMajor] = await Major.bulkCreate([
      { majorName: 'Computer Science', type: 'Bachelors', description: 'CS Degree', duration: 4 },
      { majorName: 'Business Administration', type: 'Bachelors', description: 'Business Degree', duration: 4 },
    ], { returning: true });

    const [mathMinor, econMinor] = await Minor.bulkCreate([
      { minorName: 'Mathematics', description: 'Math Minor', duration: 2 },
      { minorName: 'Economics', description: 'Economics Minor', duration: 2 },
    ], { returning: true });

    // Insert Instructors
    const [johnDoe, janeDoe] = await Instructor.bulkCreate([
      { 
        firstName: 'Kevin', 
        lastName: 'Tellez', 
        email: 'kevintelleztorres@gmail.com', 
        department: 'Computer Science', 
        password: null,
        requiresPasswordReset: true,
      },
      { 
        firstName: 'Jane', 
        lastName: 'Doe', 
        email: 'janedoe@university.com', 
        department: 'Business', 
        password: null,
        requiresPasswordReset: true,
      },
    ], { returning: true });

    // Insert Students
    const [studentA, studentB] = await Student.bulkCreate([
      { 
        firstName: 'Kevin', 
        lastName: 'Tellez', 
        DOB: '2000-05-15', 
        gender: 'Female', 
        email: '7457492@philasd.org', 
        majorID: csMajor.majorID, 
        minorID: mathMinor.minorID, 
        password: null,
        requiresPasswordReset: true,
      },
      { 
        firstName: 'Bob', 
        lastName: 'Johnson', 
        DOB: '1999-08-22', 
        gender: 'Male', 
        email: 'bob@uni.com', 
        majorID: businessMajor.majorID, 
        minorID: econMinor.minorID, 
        password: null,
        requiresPasswordReset: true,
      },
    ], { returning: true });

    // Insert Courses
    const [cs101, bus201] = await Course.bulkCreate([
      { courseName: 'Intro to Programming', description: 'Learn the basics of programming.', credits: 3, schedule: 'MWF 10:00-11:30 AM', instructorID: johnDoe.instructorID },
      { courseName: 'Business Management', description: 'Fundamentals of business management.', credits: 3, schedule: 'TTh 2:00-3:30 PM', instructorID: janeDoe.instructorID },
    ], { returning: true });

    // Insert Enrollments
    await Enrollment.bulkCreate([
      { studentID: studentA.studentID, courseID: cs101.courseID, status: 'Enrolled' },
      { studentID: studentB.studentID, courseID: bus201.courseID, status: 'Enrolled' },
    ]);

    // Insert Fees
    const [feeA, feeB] = await Fee.bulkCreate([
      { studentID: studentA.studentID, amount: 1000, dueDate: '2025-01-15', status: 'Pending' },
      { studentID: studentB.studentID, amount: 1200, dueDate: '2025-02-01', status: 'Overdue' },
    ], { returning: true });

    // Insert Payments
    await Payment.bulkCreate([
      { feeID: feeA.feeID, studentID: studentA.studentID, paymentDate: '2025-01-10', amount: 500, method: 'Credit Card', status: 'Successful' },
      { feeID: feeB.feeID, studentID: studentB.studentID, paymentDate: '2025-02-05', amount: 1200, method: 'Bank Transfer', status: 'Successful' },
    ]);

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
  };


// Export the function correctly
export default seedDatabase;
