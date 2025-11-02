import { Request, Response } from 'express';
import { initiateCheckout } from '@services/payment.service';

export async function checkout(req: Request, res: Response) {
  const { method, amount, currency, metadata } = req.body as {
    method: 'MOMO' | 'CARD' | 'COD';
    amount: number;
    currency?: string;
    metadata?: Record<string, unknown>;
  };
  if (!method || !amount) return res.status(400).json({ message: 'Missing fields' });
  const result = await initiateCheckout({ method, amount, currency, metadata });
  res.json(result);
}


