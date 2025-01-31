import express from "express";
import path from "path";
import dotenv from "dotenv";
import session from "express-session";
import sequelize from "./config/database.js"
import setupAssociations from './models/associations.js';


dotenv.config();
const app = express();

// Set EJS as templating engine
app.set("view engine", "ejs");
app.set("views", path.join(path.resolve(), "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: true }));

// Static Files
app.use(express.static("public"));

app.get('/', (req, res) => res.render('index'));
app.get('/activate', (req, res) => res.render('activate'));

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));