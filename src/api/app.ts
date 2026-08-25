/**
 * SAMADHAN — Express Application Configuration
 * Middlewares, CORS whitelist, API route mounting, and structured error handling.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { apiRouter } from './routes';

export const app = express();

// Allowed frontend origins for development
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server tests)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
}));

app.use(express.json());

// Mount API routes
app.use('/api', apiRouter);

// 404 Catch-All for undefined API endpoints
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'API route not found.',
    },
  });
});

// Centralized error handler — never exposes stack traces
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === 'Blocked by CORS policy') {
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Origin not allowed by CORS policy.',
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected internal server error occurred.',
    },
  });
});
