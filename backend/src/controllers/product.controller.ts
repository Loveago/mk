import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function serializeJSONField(field: unknown) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (err) {
      return [];
    }
  }
  return [];
}

function serializeProduct(product: any) {
  if (!product) return null;
  const { vendor, category, ...rest } = product;
  const safeVendor = vendor
    ? {
        id: vendor.id,
        storeName: vendor.storeName,
        user: vendor.user
          ? {
              id: vendor.user.id,
              name: vendor.user.name,
              email: vendor.user.email,
              phone: vendor.user.phone,
            }
          : null,
      }
    : null;

  return {
    ...rest,
    images: serializeJSONField(rest.images),
    variants: serializeJSONField(rest.variants),
    category,
    vendor: safeVendor,
  };
}

export async function listProducts(req: Request, res: Response) {
  const { categoryId, vendorId, minPrice, maxPrice, q, page = '1', pageSize = '20', status } =
    req.query as Record<string, string>;
  const where: any = {};
  if (status) where.status = status;
  else where.status = 'ACTIVE';
  if (categoryId) where.categoryId = categoryId;
  if (vendorId) where.vendorId = vendorId;
  if (minPrice || maxPrice) where.price = { gte: minPrice ? Number(minPrice) : undefined, lte: maxPrice ? Number(maxPrice) : undefined };
  if (q) where.title = { contains: q, mode: 'insensitive' };
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { category: true, vendor: { include: { user: true } } },
    }),
    prisma.product.count({ where }),
  ]);
  res.json({
    items: items.map(serializeProduct),
    total,
    page: Number(page),
    pageSize: Number(pageSize),
  });
}

export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, vendor: { include: { user: true } } },
  });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(serializeProduct(product));
}

export async function createProduct(req: Request, res: Response) {
  const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!vendorProfile) return res.status(403).json({ message: 'Vendor profile not found' });
  const { title, description, price, stock, categoryId, images, variants, weight, brand, status } = req.body;
  const product = await prisma.product.create({
    data: {
      vendorId: vendorProfile.id,
      title,
      description,
      price: Number(price),
      stock: stock ?? 0,
      categoryId,
      images: images ? JSON.stringify(images) : null,
      variants: variants ? JSON.stringify(variants) : null,
      weight,
      brand,
      status,
    },
    include: { category: true, vendor: { include: { user: true } } },
  });
  res.status(201).json(serializeProduct(product));
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = req.params;
  const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!vendorProfile) return res.status(403).json({ message: 'Vendor profile not found' });
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Not found' });
  if (existing.vendorId !== vendorProfile.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  const { title, description, price, stock, categoryId, images, variants, weight, brand, status } = req.body;
  const product = await prisma.product.update({
    where: { id },
    data: {
      title,
      description,
      price: price !== undefined ? Number(price) : undefined,
      stock,
      categoryId,
      images: images ? JSON.stringify(images) : undefined,
      variants: variants ? JSON.stringify(variants) : undefined,
      weight,
      brand,
      status,
    },
    include: { category: true, vendor: { include: { user: true } } },
  });
  res.json(serializeProduct(product));
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = req.params;
  const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!vendorProfile) return res.status(403).json({ message: 'Vendor profile not found' });
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ message: 'Not found' });
  if (existing.vendorId !== vendorProfile.id && req.user!.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}


