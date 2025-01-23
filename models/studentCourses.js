const StudentCourses = sequelize.define('StudentCourses', {
    studentID: {
        type: DataTypes.INTEGER,
        references: {
            model: Student, // Reference to Student model
            key: 'studentID',
        },
        allowNull: false,
    },
    courseID: {
        type: DataTypes.INTEGER,
        references: {
            model: Course, // Reference to Course model
            key: 'courseID',
        },
        allowNull: false,
    },
},
{
    timestamps: false, // Junction table doesn't require timestamps
});
