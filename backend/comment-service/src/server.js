const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commentRoutes = require('./routes/commentRoutes');
const { errorHandler } = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'comment-service' });
});

// Routes
app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Comment service running on port ${PORT}`);
});

module.exports = app;
