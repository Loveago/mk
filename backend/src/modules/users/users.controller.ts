import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listUsers(_req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, phone: true, role: true, status: true, createdAt: true }
  });
  res.json({ users });
}

export async function updateUserStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body ?? {};
  if (!['ACTIVE', 'SUSPENDED', 'PENDING'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const updated = await prisma.user.update({ where: { id }, data: { status } });
  res.json({ user: { id: updated.id, status: updated.status } });
}


