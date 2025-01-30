import { sequelize, Major, Minor, Student, Course, Instructor, Enrollment, Fee, Payment } from './models/index.js';
import bcrypt from 'bcrypt';

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true }); // Drops and recreates tables
    console.log('✅ Database synced successfully!');

    /** =======================
     *  INSERT MAJORS & MINORS
     *  ======================== */
    const majors = await Major.bulkCreate([
      { majorName: 'Computer Science', type: 'Bachelors', description: 'CS Major', duration: 4 },
      { majorName: 'Business Administration', type: 'Bachelors', description: 'Business Major', duration: 4 },
    ]);

    const minors = await Minor.bulkCreate([
      { minorName: 'Mathematics', description: 'Math Minor', duration: 2 },
      { minorName: 'Psychology', description: 'Psych Minor', duration: 2 },
    ]);

    /** =======================
     *  INSERT INSTRUCTORS
     *  ======================== */
    const instructors = await Instructor.bulkCreate([
      { firstName: 'John', lastName: 'Doe', email: 'johndoe@example.com', phoneNumber: '+123456789', department: 'Computer Science' },
      { firstName: 'Jane', lastName: 'Smith', email: 'janesmith@example.com', phoneNumber: '+987654321', department: 'Business' },
    ]);

    /** =======================
     *  INSERT COURSES
     *  ======================== */
    const courses = await Course.bulkCreate([
      { courseName: 'Introduction to Programming', description: 'Basics of programming', credits: 3, schedule: 'Mon-Wed-Fri 10:00 AM', instructorID: instructors[0].instructorID },
      { courseName: 'Marketing 101', description: 'Introduction to Marketing', credits: 3, schedule: 'Tue-Thu 2:00 PM', instructorID: instructors[1].instructorID },
    ]);

    /** =======================
     *  INSERT STUDENTS
     *  ======================== */
    const hashedPassword = await bcrypt.hash('password123', 10);

    const students = await Student.bulkCreate([
      { firstName: 'Alice', lastName: 'Johnson', DOB: '2002-05-10', gender: 'Female', email: '7457492@philasd.org', phoneNumber: '5551234567', address: '123 Main St', enrollmentDate: '2023-08-01', status: 'Active', majorID: majors[0].majorID, minorID: minors[0].minorID, isAccountActive: false, password: hashedPassword },
      { firstName: 'Bob', lastName: 'Williams', DOB: '2001-09-15', gender: 'Male', email: 'bob@example.com', phoneNumber: '5559876543', address: '456 Elm St', enrollmentDate: '2023-08-01', status: 'Active', majorID: majors[1].majorID, minorID: minors[1].minorID, isAccountActive: false, password: hashedPassword },
    ]);

    /** =======================
     *  INSERT ENROLLMENTS
     *  ======================== */
    await Enrollment.bulkCreate([
      { studentID: students[0].studentID, courseID: courses[0].courseID, enrollmentDate: '2024-01-15', grade: 95 },
      { studentID: students[1].studentID, courseID: courses[1].courseID, enrollmentDate: '2024-01-16', grade: 88 },
    ]);

    /** =======================
     *  INSERT FEES
     *  ======================== */
    const fees = await Fee.bulkCreate([
      { studentID: students[0].studentID, amount: 5000.00, description: 'Tuition Fee', dueDate: '2024-03-01', status: 'Pending' },
      { studentID: students[1].studentID, amount: 4500.00, description: 'Tuition Fee', dueDate: '2024-03-01', status: 'Pending' },
    ]);

    /** =======================
     *  INSERT PAYMENTS
     *  ======================== */
    await Payment.bulkCreate([
      { feeID: fees[0].feeID, studentID: students[0].studentID, paymentDate: '2024-02-01', amount: 2500.00, method: 'Credit Card', referenceNumber: 'TXN123' },
      { feeID: fees[1].feeID, studentID: students[1].studentID, paymentDate: '2024-02-02', amount: 4500.00, method: 'Bank Transfer', referenceNumber: 'TXN456' },
    ]);

    console.log('✅ Sample data inserted successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();
