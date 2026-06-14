// This brings in the Express library we installed
const express = require('express');

// This creates our server application
const app = express();

// This lets our server understand JSON data sent from frontend
app.use(express.json());

// This is a simple test route
// When someone visits http://localhost:5000/ they get this response
app.get('/', (req, res) => {
  res.send('NexLearn Backend is running! 🚀');
});

// This starts the server on port 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});