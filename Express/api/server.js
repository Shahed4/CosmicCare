import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import apiRoutes from './routes/transcribeRoute.js';
import { logInfo, logError } from './utils/logger.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🎧 Rant & Reflect API',
    version: '1.0.0',
    endpoints: {
      transcribe: 'POST /api/transcribe',
      health: 'GET /api/health',
    },
  });
});

app.use('/api', apiRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  logError('Express error handler', error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: true,
        message: 'File size exceeds 25MB limit',
        code: 'FILE_TOO_LARGE',
      });
    }
  }

  res.status(error.status || 500).json({
    error: true,
    message: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
  });
});

// Start server
app.listen(PORT, () => {
  logInfo(`🚀 Rant & Reflect API running on port ${PORT}`);
  logInfo(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  logInfo(`🌐 CORS enabled for: ${process.env.ALLOWED_ORIGIN || 'http://localhost:3000'}`);
});