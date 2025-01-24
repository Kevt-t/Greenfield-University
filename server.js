import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import {} from './models/associations.js'
import sequelize from './config/database.js'; // Import database connection

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files setup
app.use(express.static(path.join(__dirname, 'public')));




// Basic navigation views
app.get('/', (req, res) => res.render('index'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));

// Start our server
app.listen(PORT, () => { // port is passed here
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log() // blank log to make console out more readable
});