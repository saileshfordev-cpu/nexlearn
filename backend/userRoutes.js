// This brings in Express's router - lets us organize routes separately
const express = require('express');
const router = express.Router();

// This brings in bcrypt for password hashing
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// This brings in our database connection
const pool = require('./db');

// SIGNUP ROUTE
// When someone sends a POST request to /signup, this code runs
router.post('/signup', async (req, res) => {
  try {
    // Get data sent from frontend (name, email, password, role)
    const { name, email, password, role } = req.body;

    // Hash the password - "10" means how complex the scrambling is
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    // Send back the new user's info (without password!)
    res.status(201).json({
      message: 'User registered successfully! ✅',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Registration failed ❌',
      error: error.message
    });
  }
});
// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    // If no user found with this email
    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found ❌' });
    }

    const user = result.rows[0];

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password ❌' });
    }

    // Create a JWT token - like a digital ID card that proves who you are
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send back token and user info (NOT password)
    res.json({
      message: 'Login successful! ✅',
      token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Login failed ❌',
      error: error.message
    });
  }
});
// We export this router so index.js can use it
module.exports = router;
