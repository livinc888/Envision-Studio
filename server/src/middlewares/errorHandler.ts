import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // If headers already sent, delegate to default express handler
  if (res.headersSent) {
    return _next(err);
  }

  if (err instanceof ZodError || err?.name === 'ZodError' || Array.isArray(err?.issues)) {
    const issues = err.issues || err.errors || [];
    const formattedDetails = Array.isArray(issues)
      ? issues.map((e: any) => ({
          field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
          message: e.message || 'Invalid value'
        }))
      : [];

    res.status(400).json({
      error: 'Validation failed',
      details: formattedDetails
    });
    return;
  }

  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message
  });
}
