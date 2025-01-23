const Major = sequelize.define('Major', {
    majorID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
  
    majorName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100], // Restrict length to reasonable limits
      },
    },
  
    duration: {
      type: DataTypes.INTEGER, // Duration in years
      allowNull: false,
      validate: {
        min: 1, // At least 1 year
        max: 7, // Arbitrary maximum for flexibility
      },
    },
  },
  {
    timestamps: false, // Majors don't usually require timestamps
  });
  
  export default Major;
  