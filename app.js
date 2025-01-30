import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { sequelize } from './models/index.js'; // ✅ Use named import for sequelize
import setupAssociations from './models/associations.js';
import activationRoutes from './routes/activation.js';
import loginRoutes from './routes/login.js';
import resetPWRoutes from './routes/resetPassword.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();
const app = express();

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));

// Render EJS pages
app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));
app.get('/student-login', (req, res) => res.render('student-login'));
app.get('/studentDashboard', (req, res) => res.render('studentDashboard'));

// Mount routes
app.use("/activate", activationRoutes);
app.use("/login", loginRoutes)
app.use("/reset-password", resetPWRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));