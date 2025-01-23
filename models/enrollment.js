const Enrollment = sequelize.define('Enrollment', {
    enrollmentID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    studentID: {
      type: DataTypes.INTEGER,
      references: {
        model: Student,
        key: 'studentID',
      },
      allowNull: false,
    },
    courseID: {
      type: DataTypes.INTEGER,
      references: {
        model: Course,
        key: 'courseID',
      },
      allowNull: false,
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    grade: {
      type: DataTypes.FLOAT, // Optional: Use ENUM or String to store grades (e.g., 'A', 'B', etc.)
      allowNull: true,
    },
  }, {
    timestamps: false,
  });