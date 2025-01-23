import sequelize from './config/database.js'; // Import the Sequelize instance
import Student from './models/students.js';
import Major from './models/majors.js';
import Minor from './models/minors.js';
import Course from './models/courses.js';
import Instructor from './models/instructors.js';
import Enrollment from './models/enrollment.js';

const seedDatabase = async () => {
  try {
    // Sync database (optional: set force: true to drop tables and recreate them)
    await sequelize.sync({ force: true });

    console.log('Database synced successfully.');

    // Seed Majors
    const majors = await Major.bulkCreate([
      { majorName: 'Computer Science', type: 'Bachelors', description: 'Focus on software and hardware systems.', duration: 4 },
      { majorName: 'Business Administration', type: 'Masters', description: 'Focus on business and management principles.', duration: 2 },
      { majorName: 'Mechanical Engineering', type: 'Bachelors', description: 'Focus on mechanical systems and design.', duration: 4 },
    ]);

    console.log('Majors seeded.');

    // Seed Minors
    const minors = await Minor.bulkCreate([
      { minorName: 'Mathematics', description: 'Focus on mathematical principles.', duration: 2 },
      { minorName: 'Data Science', description: 'Focus on data analysis and machine learning.', duration: 2 },
      { minorName: 'Psychology', description: 'Focus on human behavior and mental processes.', duration: 2 },
    ]);

    console.log('Minors seeded.');

    // Seed Instructors
    const instructors = await Instructor.bulkCreate([
      { firstName: 'Alice', lastName: 'Smith', email: 'alice.smith@university.edu', phoneNumber: '+1234567890', department: 'Computer Science' },
      { firstName: 'Bob', lastName: 'Johnson', email: 'bob.johnson@university.edu', phoneNumber: '+1234567891', department: 'Business Administration' },
      { firstName: 'Charlie', lastName: 'Brown', email: 'charlie.brown@university.edu', phoneNumber: '+1234567892', department: 'Mechanical Engineering' },
    ]);

    console.log('Instructors seeded.');

    // Seed Courses
    const courses = await Course.bulkCreate([
      { courseName: 'Introduction to Programming', description: 'Learn the basics of programming.', credits: 3, schedule: 'Mon-Wed-Fri 10:00-11:00', instructorID: instructors[0].instructorID },
      { courseName: 'Machine Learning', description: 'Introduction to machine learning concepts.', credits: 4, schedule: 'Tue-Thu 14:00-15:30', instructorID: instructors[0].instructorID },
      { courseName: 'Business Strategy', description: 'Learn strategic planning and execution.', credits: 3, schedule: 'Mon-Wed 12:00-13:30', instructorID: instructors[1].instructorID },
      { courseName: 'Thermodynamics', description: 'Understand heat and energy systems.', credits: 3, schedule: 'Fri 14:00-16:00', instructorID: instructors[2].instructorID },
    ]);

    console.log('Courses seeded.');

    // Seed Students
    const students = await Student.bulkCreate([
      {
        firstName: 'John',
        lastName: 'Doe',
        DOB: '2000-01-01',
        gender: 'Male',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        address: '123 Main Street',
        enrollmentDate: '2022-09-01',
        status: 'Active',
        majorID: majors[0].majorID,
        minorID: minors[0].minorID,
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        DOB: '2001-05-15',
        gender: 'Female',
        email: 'jane.smith@example.com',
        phoneNumber: '9876543210',
        address: '456 Elm Street',
        enrollmentDate: '2021-09-01',
        status: 'Active',
        majorID: majors[1].majorID,
        minorID: minors[1].minorID,
      },
      {
        firstName: 'Emma',
        lastName: 'Johnson',
        DOB: '1999-08-22',
        gender: 'Female',
        email: 'emma.johnson@example.com',
        phoneNumber: '1122334455',
        address: '789 Oak Street',
        enrollmentDate: '2020-09-01',
        status: 'Graduated',
        majorID: majors[2].majorID,
        minorID: null,
      },
    ]);

    console.log('Students seeded.');

    // Seed Enrollments
    await Enrollment.bulkCreate([
      { studentID: students[0].studentID, courseID: courses[0].courseID, enrollmentDate: '2022-09-05', grade: 90 },
      { studentID: students[0].studentID, courseID: courses[1].courseID, enrollmentDate: '2022-09-06', grade: 85 },
      { studentID: students[1].studentID, courseID: courses[2].courseID, enrollmentDate: '2021-09-07', grade: 88 },
      { studentID: students[2].studentID, courseID: courses[3].courseID, enrollmentDate: '2020-09-08', grade: 92 },
    ]);

    console.log('Enrollments seeded.');

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error while seeding the database:', error);
  } finally {
    await sequelize.close(); // Close the connection after seeding
  }
};

seedDatabase();
