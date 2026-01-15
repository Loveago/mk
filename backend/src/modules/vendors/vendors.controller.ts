import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listVendors(_req: Request, res: Response) {
  const vendors = await prisma.user.findMany({
    where: { role: 'VENDOR' },
    select: { id: true, email: true, status: true, vendorProfile: true }
  });
  res.json({ vendors });
}

export async function approveVendor(req: Request, res: Response) {
  const { id } = req.params;
  const user = await prisma.user.update({
    where: { id },
    data: { status: 'ACTIVE', vendorProfile: { update: { approvedAt: new Date() } } }
  });
  res.json({ user: { id: user.id, status: user.status } });
}

export async function getVendorMe(req: Request, res: Response) {
  const id = req.auth?.userId!;
  const vendor = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, vendorProfile: true }
  });
  res.json({ vendor });
}


