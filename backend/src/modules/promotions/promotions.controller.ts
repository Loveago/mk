import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listPromotions(_req: Request, res: Response) {
  const now = new Date();
  const promos = await prisma.promotion.findMany({ where: { startAt: { lte: now }, endAt: { gte: now } } });
  res.json({ promotions: promos });
}

export async function createPromotion(req: Request, res: Response) {
  const { name, discountPercent, startAt, endAt } = req.body ?? {};
  const promo = await prisma.promotion.create({ data: { name, discountPercent, startAt: new Date(startAt), endAt: new Date(endAt) } });
  res.status(201).json({ promotion: promo });
}


