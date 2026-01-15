import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function createOrder(req: Request, res: Response) {
  const customerId = req.auth?.userId!;
  const { items, shippingAddressId } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'No items' });
  const products = await prisma.product.findMany({ where: { id: { in: items.map((i: any) => i.productId) } } });
  const total = items.reduce((sum: number, i: any) => {
    const p = products.find((pp) => pp.id === i.productId);
    if (!p) return sum;
    return sum + p.price * i.quantity;
  }, 0);
  const order = await prisma.order.create({
    data: {
      customerId,
      total,
      currency: 'GHS',
      status: 'PENDING',
      shippingAddressId,
      items: {
        create: items.map((i: any) => ({ productId: i.productId, quantity: i.quantity, unitPrice: products.find((p) => p.id === i.productId)!.price }))
      }
    },
    include: { items: true }
  });
  res.status(201).json({ order });
}

export async function listMyOrders(req: Request, res: Response) {
  const customerId = req.auth?.userId!;
  const orders = await prisma.order.findMany({ where: { customerId }, include: { items: true } });
  res.json({ orders });
}

export async function listAllOrders(_req: Request, res: Response) {
  const orders = await prisma.order.findMany({ include: { items: true, customer: { select: { email: true } } } });
  res.json({ orders });
}

export async function updateOrderStatus(req: Request, res: Response) {
  const { id } = req.params;
  const { status } = req.body ?? {};
  const updated = await prisma.order.update({ where: { id }, data: { status } });
  res.json({ order: updated });
}


