const Fee = sequelize.define('Fee', {
  feeID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  studentID: {
    type: DataTypes.INTEGER,
    references: { model: Student, key: 'studentID' },
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Paid', 'Pending', 'Overdue'),
    allowNull: false,
    defaultValue: 'Pending',
  },
});
