import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: Array<'ADMIN' | 'VENDOR' | 'CUSTOMER'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.auth?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    return next();
  };
}


