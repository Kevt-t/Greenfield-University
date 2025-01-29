import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js'; // ✅ Use named import for sequelize
import setupAssociations from './models/associations.js';
import activationRoutes from './routes/activation.js'

dotenv.config();
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

// Routes
app.get('/', (req, res) => res.render('activate'));


app.use("/activate", activationRoutes);

const PORT = process.env.PORT || 3000;

// Sync database and start server

app.listen(PORT, () => console.log(`🚀 Server running on port http://localhost:${PORT}`));
  