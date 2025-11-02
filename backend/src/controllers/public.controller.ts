import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const heroSlides = [
  {
    id: 'hero-1',
    title: 'Mega Tech Deals',
    subtitle: 'Save up to 40% on phones & electronics',
    cta: 'Shop Flash Sale',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hero-2',
    title: 'Appliances Bonanza',
    subtitle: 'Upgrade your home with top brands',
    cta: 'Discover Appliances',
    image: 'https://images.unsplash.com/photo-1616628182504-7be4954b1aa6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'hero-3',
    title: 'Stay Stylish',
    subtitle: 'Fashion picks inspired by Accra trends',
    cta: 'Shop Style',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
  },
];

function serializeImages(value: unknown) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (err) {
      return [];
    }
  }
  return [];
}

export async function getHomeContent(_req: Request, res: Response) {
  const [categories, latestProducts, flashSale] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' }, take: 10 }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.product.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { stock: 'desc' },
      take: 4,
    }),
  ]);

  const vendors = await prisma.vendorProfile.findMany({
    take: 3,
    include: { user: true, _count: { select: { products: true } } },
  });

  res.json({
    heroSlides,
    categories,
    featuredProducts: latestProducts.map((product) => ({
      ...product,
      images: serializeImages(product.images),
    })),
    flashSale: flashSale.map((product) => ({
      ...product,
      images: serializeImages(product.images),
    })),
    topVendors: vendors.map((vendor) => ({
      id: vendor.id,
      storeName: vendor.storeName,
      totalProducts: vendor._count.products,
      owner: vendor.user ? { id: vendor.user.id, name: vendor.user.name } : null,
    })),
  });
}


