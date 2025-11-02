import { Request, Response } from 'express';
import { PrismaClient, OrderStatus } from '@prisma/client';

const prisma = new PrismaClient();

function serializeOrder(order: any) {
  const { orderItems, user, shippingInfo, ...rest } = order;
  return {
    ...rest,
    shippingInfo: shippingInfo ? JSON.parse(shippingInfo) : null,
    user: user
      ? {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        }
      : null,
    orderItems: orderItems?.map((item: any) => ({
      ...item,
      product: item.product
        ? {
            id: item.product.id,
            title: item.product.title,
            price: item.product.price,
            images: item.product.images ? JSON.parse(item.product.images) : [],
          }
        : null,
    })),
  };
}

export async function createOrder(req: Request, res: Response) {
  const userId = req.user!.id;
  const { items, paymentMethod, shippingInfo } = req.body as {
    items: { productId: string; quantity: number }[];
    paymentMethod: string;
    shippingInfo?: unknown;
  };
  if (!items?.length) return res.status(400).json({ message: 'No items' });

  // fetch products & compute totals
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  if (products.length !== items.length) return res.status(400).json({ message: 'Invalid products' });

  const orderItemsData = items.map((i) => {
    const p = products.find((x) => x.id === i.productId)!;
    const subtotal = Number(p.price) * i.quantity;
    return { productId: p.id, quantity: i.quantity, subtotal };
  });
  const total = orderItemsData.reduce((acc, it) => acc + it.subtotal, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      paymentMethod,
      shippingInfo: shippingInfo ? JSON.stringify(shippingInfo) : null,
      total,
      orderItems: {
        createMany: {
          data: orderItemsData.map((item) => ({ ...item, subtotal: Number(item.subtotal) })),
        },
      },
    },
    include: { orderItems: { include: { product: true } }, user: true },
  });
  res.status(201).json(serializeOrder(order));
}

export async function getMyOrders(req: Request, res: Response) {
  const userId = req.user!.id;
  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { product: true } }, user: true },
  });
  res.json(orders.map(serializeOrder));
}

export async function listAllOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { product: true } }, user: true },
  });
  res.json(orders.map(serializeOrder));
}

export async function listVendorOrders(req: Request, res: Response) {
  const vendorProfile = await prisma.vendorProfile.findUnique({ where: { userId: req.user!.id } });
  if (!vendorProfile) return res.status(403).json({ message: 'Vendor profile not found' });
  // Orders that contain at least one item belonging to this vendor
  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: { product: { vendorId: vendorProfile.id } },
      },
    },
    orderBy: { createdAt: 'desc' },
    include: { orderItems: { include: { product: true } }, user: true },
  });
  res.json(orders.map(serializeOrder));
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body as { status: OrderStatus };
  const updated = await prisma.order.update({
    where: { id },
    data: { status },
    include: { orderItems: { include: { product: true } }, user: true },
  });
  res.json(serializeOrder(updated));
}


