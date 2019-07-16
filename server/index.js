const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log('Server started...'));

// Middleware
app.use((req, res, next) => {
  // Bypass CORS error on client
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:4200'); // Your client root url here
  next();
});

// Routes
app.use('/join', require('./routes/join'));

// No routes found for request
app.use((req, res) => {
    res.status(404)
      .json({
        message: "Unknown request"
      });
});
