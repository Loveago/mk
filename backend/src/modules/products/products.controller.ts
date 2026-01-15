import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listProducts(req: Request, res: Response) {
  const { q, category, minPrice, maxPrice } = req.query;
  const products = await prisma.product.findMany({
    where: {
      name: q ? { contains: String(q), mode: 'insensitive' } : undefined,
      category: category ? { slug: String(category) } : undefined,
      price: { gte: minPrice ? Number(minPrice) : undefined, lte: maxPrice ? Number(maxPrice) : undefined },
      status: 'ACTIVE'
    },
    select: { id: true, name: true, slug: true, price: true, currency: true, images: true }
  });
  res.json({ products });
}

export async function getProductBySlug(req: Request, res: Response) {
  const { slug } = req.params;
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true, vendor: { select: { id: true, vendorProfile: true } } } });
  if (!product) return res.status(404).json({ error: 'Not found' });
  res.json({ product });
}

export async function createProduct(req: Request, res: Response) {
  const vendorId = req.auth?.userId;
  const { name, slug, description, price, currency, categoryId, stockQty } = req.body ?? {};
  if (!name || !slug || !price || !categoryId) return res.status(400).json({ error: 'Missing fields' });
  const created = await prisma.product.create({
    data: { name, slug, description, price, currency: currency ?? 'GHS', categoryId, stockQty: stockQty ?? 0, vendorId: vendorId! }
  });
  res.status(201).json({ product: created });
}


