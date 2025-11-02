import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ALLOWED_STATUSES = ['ACTIVE', 'SUSPENDED', 'PENDING'];

export async function getAdminSummary(_req: Request, res: Response) {
  const [users, vendors, orders, sales] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: 'VENDOR' } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true } }),
  ]);

  const pendingVendors = await prisma.user.count({ where: { role: 'VENDOR', status: 'PENDING' } });

  res.json({
    users,
    vendors,
    orders,
    pendingVendors,
    totalSales: Number(sales._sum.total || 0),
  });
}

export async function listUsers(_req: Request, res: Response) {
  const results = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: { vendorProfile: true },
    take: 200,
  });
  res.json(results);
}

export async function updateUserStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status },
    include: { vendorProfile: true },
  });
  res.json(updated);
}

export async function listVendors(_req: Request, res: Response) {
  const vendorProfiles = await prisma.vendorProfile.findMany({
    include: {
      user: true,
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const vendorIds = vendorProfiles.map((vendor) => vendor.id);
  if (!vendorIds.length) return res.json([]);

  const orderItems = await prisma.orderItem.findMany({
    where: { product: { vendorId: { in: vendorIds } } },
    include: { product: { select: { vendorId: true } } },
  });

  const stats = vendorIds.reduce<Record<string, { orderCount: number; sales: number }>>((acc, id) => {
    acc[id] = { orderCount: 0, sales: 0 };
    return acc;
  }, {});

  orderItems.forEach((item) => {
    const vendorId = item.product.vendorId;
    const subtotal = Number(item.subtotal || 0);
    stats[vendorId].orderCount += 1;
    stats[vendorId].sales += subtotal;
  });

  const payload = vendorProfiles.map((vendor) => ({
    ...vendor,
    user: vendor.user,
    metrics: stats[vendor.id],
  }));

  res.json(payload);
}

export async function updateVendorStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: string };
  if (!status || !ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  const updated = await prisma.user.update({
    where: { id, role: 'VENDOR' },
    data: { status },
    include: { vendorProfile: true },
  });
  res.json(updated);
}

export async function listPromotions(_req: Request, res: Response) {
  const promotions = await prisma.promotion.findMany({ orderBy: { startDate: 'desc' } });
  res.json(promotions);
}

export async function createPromotion(req: Request, res: Response) {
  const { title, discount, startDate, endDate } = req.body as {
    title: string;
    discount: number;
    startDate: string;
    endDate: string;
  };

  if (!title || !discount || !startDate || !endDate) {
    return res.status(400).json({ message: 'Missing promotion fields' });
  }

  const promotion = await prisma.promotion.create({
    data: {
      title,
      discount: Number(discount),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    },
  });
  res.status(201).json(promotion);
}

export async function updatePromotion(req: Request, res: Response) {
  const { id } = req.params;
  const { title, discount, startDate, endDate } = req.body as {
    title?: string;
    discount?: number;
    startDate?: string;
    endDate?: string;
  };

  const promotion = await prisma.promotion.update({
    where: { id },
    data: {
      title,
      discount: discount !== undefined ? Number(discount) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  });
  res.json(promotion);
}

export async function deletePromotion(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.promotion.delete({ where: { id } });
  res.status(204).send();
}

export async function listPages(_req: Request, res: Response) {
  const pages = await prisma.page.findMany({ orderBy: { title: 'asc' } });
  res.json(pages);
}

export async function createPage(req: Request, res: Response) {
  const { title, slug, content } = req.body as { title: string; slug: string; content: string };
  if (!title || !slug || !content) return res.status(400).json({ message: 'Missing page fields' });

  const page = await prisma.page.create({ data: { title, slug, content } });
  res.status(201).json(page);
}

export async function updatePage(req: Request, res: Response) {
  const { id } = req.params;
  const { title, slug, content } = req.body as { title?: string; slug?: string; content?: string };
  const page = await prisma.page.update({ where: { id }, data: { title, slug, content } });
  res.json(page);
}

export async function deletePage(req: Request, res: Response) {
  const { id } = req.params;
  await prisma.page.delete({ where: { id } });
  res.status(204).send();
}


