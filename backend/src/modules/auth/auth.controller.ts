import { Request, Response } from 'express';
import { prisma } from '../../db/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

function sign(userId: string, role: 'ADMIN' | 'VENDOR' | 'CUSTOMER') {
  return jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' });
}

export async function registerCustomer(req: Request, res: Response) {
  const { email, password, firstName, lastName, phone } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      role: 'CUSTOMER',
      status: 'ACTIVE',
      customerProfile: { create: { firstName, lastName } }
    }
  });
  const token = sign(user.id, user.role);
  res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ token });
}

export async function registerVendor(req: Request, res: Response) {
  const { email, password, companyName, displayName, phone } = req.body ?? {};
  if (!email || !password || !companyName) return res.status(400).json({ error: 'Missing fields' });
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ error: 'Email already exists' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      phone,
      passwordHash,
      role: 'VENDOR',
      status: 'PENDING',
      vendorProfile: { create: { companyName, displayName } }
    }
  });
  return res.json({ message: 'Vendor registered. Await admin approval.', userId: user.id });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body ?? {};
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  if (user.role === 'VENDOR' && user.status !== 'ACTIVE') {
    return res.status(403).json({ error: 'Vendor not approved yet' });
  }
  const token = sign(user.id, user.role);
  res.cookie('access_token', token, { httpOnly: true, sameSite: 'lax' });
  return res.json({ token, role: user.role });
}

export async function me(req: Request, res: Response) {
  const id = req.auth?.userId;
  if (!id) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true, email: true, role: true, status: true } });
  return res.json({ user });
}


