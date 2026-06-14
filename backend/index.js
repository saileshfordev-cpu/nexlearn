// This brings in the Express library we installed
const express = require('express');
const quizRoutes = require('./quizRoutes');


// This brings in our database connection
const pool = require('./db');

// This brings in our user routes (signup, login etc)
const userRoutes = require('./userRoutes');

// This creates our server application
const app = express();

// This lets our server understand JSON data sent from frontend
app.use(express.json());
app.use('/api/quiz', quizRoutes);
// This connects all /api/users routes to our userRoutes file
app.use('/api/users', userRoutes);

// This is a simple test route
app.get('/', (req, res) => {
  res.send('NexLearn Backend is running! 🚀');
});

// This route tests our database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      message: 'Database connected successfully! ✅',
      time: result.rows[0].now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Database connection failed ❌',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});