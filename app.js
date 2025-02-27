import express from "express";
import path from "path";
import dotenv from "dotenv";

import cookieParser from 'cookie-parser';

import './models/index.js';  // This ensures models & associations are set before server starts
import setupAssociations from './models/associations.js';

import loginRoutes from './routes/login.js';
import resetPasswordRoutes from './routes/reset-password.js';
import authRoutes from './routes/auth.js';


dotenv.config();
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middleware to parse JSON and form data
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser()); // Handles cookies

// Static Files
app.use(express.static("public"));

//Routes
app.use('/auth', authRoutes);
app.use('/auth', loginRoutes);
app.use('/auth', resetPasswordRoutes);


// Render views for basic navigation
app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));
app.get('/activation-success', (req, res) => res.render('activation-success')); 
app.get('/login', (req, res) => res.render('login')); //login portal for student and instructor
app.get('/reset-password', (req, res) => res.render('reset-password')); //reset password page for initial sign ups

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
