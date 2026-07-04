require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const readingRouter = require('./routes/reading');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rate limiting: 100 requests per user per day
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// App Store support page
app.get('/support', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'support.html'));
});

// Routes
app.use('/api', readingRouter);

app.listen(PORT, () => {
  console.log(`CosmicTransit API running on port ${PORT}`);
});
