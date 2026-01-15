import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ categories });
}

export async function createCategory(req: Request, res: Response) {
  const { name, slug, parentId } = req.body ?? {};
  if (!name || !slug) return res.status(400).json({ error: 'name and slug required' });
  const category = await prisma.category.create({ data: { name, slug, parentId: parentId ?? null } });
  res.status(201).json({ category });
}


