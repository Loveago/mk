import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function getSettings(_req: Request, res: Response) {
  const settings = await prisma.siteSetting.findMany();
  res.json({ settings });
}

export async function updateSettings(req: Request, res: Response) {
  const entries = Array.isArray(req.body) ? req.body : [];
  const results = [] as any[];
  for (const entry of entries) {
    const s = await prisma.siteSetting.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: { key: entry.key, value: entry.value }
    });
    results.push(s);
  }
  res.json({ settings: results });
}


