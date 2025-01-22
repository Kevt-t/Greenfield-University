import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js'; // Import database connection
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import authenticateToken from './middleware/authMiddleware.js';
import { User, Transaction } from './models/associations.js'; // Ensure associations are set up

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

// Routes
app
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

// Protected route for dashboard
app.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      include: { model: Transaction, as: 'transactions', order: [['createdAt', 'DESC']] },
    });

    if (!user) {
      return res.status(404).send('User not found.');
    }

    res.render('dashboard', { user });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).send('Internal server error.');
  }
});

// Basic navigation views
app.get('/', (req, res) => res.render('index'));
app.get('/signup', (req, res) => res.render('signup'));
app.get('/login', (req, res) => res.render('login'));

// Start our server
app.listen(PORT, () => { // port is passed here
  
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log() // blank log to make console out more readable
});