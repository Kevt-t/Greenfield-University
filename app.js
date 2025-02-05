import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import sequelize from "./config/database.js";
import './models/index.js';  // This ensures models & associations are set before server starts
import setupAssociations from './models/associations.js';

import authRoutes from './routes/auth.js';


dotenv.config();
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET || 'secret_key', resave: false, saveUninitialized: true }));

// Static Files
app.use(express.static("public"));

//Routes
app.use('/auth', authRoutes);


// Render views for basic navigation
app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));
app.get('/login', (req, res) => res.render('login')); //login portal for student and instructor

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
