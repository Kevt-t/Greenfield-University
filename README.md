# 🏫 Greenfield University Student & Instructor Management System

## 📚 Overview
Greenfield University's Student & Instructor Management System (GFU-SIMS) is a full-stack web application that enables:
- **Students** to view their enrolled courses, grades, and outstanding fees.
- **Instructors** to create, manage, and delete courses, as well as enroll and manage students within those courses.
- **Both roles** to securely log in and manage their academic profiles.

---

## 🚀 Features

### For Students
- View enrolled courses and grades.
- Pay outstanding fees.
- View GPA and overall academic standing.
- Secure login and account activation.

### For Instructors
- Create new courses.
- Edit and delete existing courses.
- Enroll students into courses.
- Assign or update student grades.
- Remove students from courses.
- Secure login and account activation.
---

## 📂 Directory Structure

```
GFU/
├── config/
│   └── database.js                    # Sequelize database configuration
├── middleware/
│   └── auth.js                         # JWT authentication middleware
├── models/
│   ├── courses/
│   │   ├── courses.js                  # Course model
│   │   ├── enrollments.js              # Enrollment model (student-course relationship)
│   │   └── instructors.js              # Instructor model
│   ├── finance/
│   │   ├── fees.js                      # Student fees model
│   │   └── payments.js                  # Payment transactions model
│   ├── student/
│   │   ├── majors.js                    # Major model
│   │   ├── minors.js                    # Minor model
│   │   └── students.js                  # Student model
│   ├── associations.js                  # Sequelize model relationships
│   └── index.js                         # Entry point for all models
├── public/
│   └── scripts/
│       ├── activateFrontEnd.js         # Frontend logic for account activation
│       └── loginFrontEnd.js            # Frontend logic for login flow
├── routes/
│   ├── auth.js                         # Account activation & authentication routes
│   ├── dashboard.js                    # Student & instructor dashboard routes
│   ├── enrollments.js                  # Enrollment management routes
│   ├── instructors.js                  # Instructor-specific course & student management routes
│   ├── login.js                        # Login/logout routes
│   ├── payments.js                     # Payment handling routes
│   └── reset-password.js               # Password reset routes
├── views/
│   ├── activate.ejs                    # Account activation page
│   ├── activation-success.ejs          # Activation success confirmation page
│   ├── index.ejs                       # Landing page with navigation options
│   ├── instructor-dashboard.ejs        # Instructor dashboard page
│   ├── login.ejs                       # Login page
│   ├── pay-fees.ejs                    # Student fee payment page
│   ├── reset-password.ejs              # Password reset page
│   ├── student-dashboard.ejs           # Student dashboard page
│   └── (Optional future) admin-dashboard.ejs
└── app.js                             # Main Express application entry point
```

## .env
```
PORT=3000
DATABASE_URL=<your-database-url>
JWT_SECRET=<your-secret-key>
EMAIL_USER=<your-email@example.com>
EMAIL_PASS=<your-email-password>
NODE_ENV=development
```


## How to use on your machine

- Head over to https://myaccount.google.com/security

- Find "Less secure app access" and turn it on

- Make sure to plug in email and password into the .env

### Adjust Sample Data

- Go into seed.js 
- Replace the emails associated with an instructor with one of your emails along with the first and last name 
- if await sequelize.sync was false in models/index.js make sure it's true and up to date with the adjusted data
- Clear for demo







