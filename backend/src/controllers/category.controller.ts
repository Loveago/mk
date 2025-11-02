import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function listCategories(_req: Request, res: Response) {
  const categories = await prisma.category.findMany({ include: { children: true } });
  res.json(categories);
}

export async function createCategory(req: Request, res: Response) {
  const { name, parentId } = req.body;
  const category = await prisma.category.create({ data: { name, parentId } });
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;
  const { name, parentId } = req.body;
  const updated = await prisma.category.update({ where: { id }, data: { name, parentId } });
  res.json(updated);
}

export async function deleteCategory(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.category.delete({ where: { id } });
  res.status(204).send();
}


