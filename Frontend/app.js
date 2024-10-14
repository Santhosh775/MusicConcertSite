const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'Frontend' directory
app.use(express.static(path.join(__dirname, 'Front')));

// Default route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Front', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
