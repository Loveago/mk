import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';

export async function listRegions(_req: Request, res: Response) {
  const regions = [
    'Greater Accra',
    'Ashanti',
    'Northern',
    'Western',
    'Central',
    'Eastern',
    'Volta',
    'Upper East',
    'Upper West',
    'Savannah',
    'North East',
    'Bono',
    'Bono East',
    'Ahafo',
    'Western North',
    'Oti'
  ];
  res.json({ regions });
}

export async function createShipment(req: Request, res: Response) {
  const { orderId, carrier, trackingNumber, cost, region } = req.body ?? {};
  const created = await prisma.shipment.create({ data: { orderId, carrier, trackingNumber, cost, region, status: 'PROCESSING' } });
  res.status(201).json({ shipment: created });
}

export async function updateShipment(req: Request, res: Response) {
  const { id } = req.params;
  const { status, trackingNumber } = req.body ?? {};
  const updated = await prisma.shipment.update({ where: { id }, data: { status, trackingNumber } });
  res.json({ shipment: updated });
}


