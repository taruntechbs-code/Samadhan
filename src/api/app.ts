/**
 * SAMADHAN — Express Application Configuration
 * Middlewares, security headers, CORS whitelist, API route mounting, static SPA serving, and structured error handling.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { apiRouter } from './routes';

export const app = express();

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; font-src 'self' https://fonts.gstatic.com data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data: https:; connect-src 'self' https://*.onrender.com http://localhost:* http://127.0.0.1:*;"
  );
  next();
});

// Allowed frontend origins for development and production
const ALLOWED_ORIGIN_PATTERNS = [
  /^http:\/\/localhost:\d+$/,
  /^http:\/\/127\.0\.0\.1:\d+$/,
  /^https:\/\/.*\.onrender\.com$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server tests, same-origin)
      if (!origin || ALLOWED_ORIGIN_PATTERNS.some(pattern => pattern.test(origin))) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
  })
);

app.use(express.json({ limit: '5mb' }));

// Mount API routes under /api
app.use('/api', apiRouter);

// 404 Catch-All for undefined /api/* endpoints specifically
app.use('/api', (_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'API route not found.',
    },
  });
});

// Production Static SPA Serving from dist/
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1h' }));

  // SPA Route Fallback (for /track, /grievances, /government, etc.)
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
}

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
