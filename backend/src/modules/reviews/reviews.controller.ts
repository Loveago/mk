import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listReviews(req: Request, res: Response) {
  const { productId } = req.params;
  const reviews = await prisma.review.findMany({ where: { productId }, include: { customer: { select: { email: true } } } });
  res.json({ reviews });
}

export async function addReview(req: Request, res: Response) {
  const { productId } = req.params;
  const customerId = req.auth?.userId!;
  const { rating, comment } = req.body ?? {};
  const created = await prisma.review.create({ data: { productId, customerId, rating, comment, status: 'PENDING' } });
  res.status(201).json({ review: created });
}


