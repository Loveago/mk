import { Request, Response } from 'express';
import { PrismaClient, UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '@utils/jwt';

const prisma = new PrismaClient();

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, vendorProfile, ...rest } = user;
  return {
    ...rest,
    vendorProfile: vendorProfile
      ? {
          id: vendorProfile.id,
          storeName: vendorProfile.storeName,
          bankInfo: vendorProfile.bankInfo,
        }
      : null,
  };
}

export async function register(req: Request, res: Response) {
  const { name, email, phone, password, role, storeName } = req.body as {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: UserRole;
    storeName?: string;
  };

  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already in use' });

  const hash = await bcrypt.hash(password, 10);
  const userRole = role && Object.values(UserRole).includes(role) ? role : UserRole.CUSTOMER;

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hash,
      role: userRole,
      status: userRole === UserRole.VENDOR ? UserStatus.PENDING : UserStatus.ACTIVE,
    },
    include: { vendorProfile: true },
  });

  if (userRole === UserRole.VENDOR) {
    await prisma.vendorProfile.create({ data: { userId: user.id, storeName: storeName || `${name}'s Store` } });
  }

  const newUser = await prisma.user.findUnique({ where: { id: user.id }, include: { vendorProfile: true } });

  const payload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return res.status(201).json({
    accessToken,
    refreshToken,
    user: sanitizeUser(newUser),
    message: userRole === UserRole.VENDOR ? 'Vendor registration pending approval.' : 'Registered successfully.',
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  const user = await prisma.user.findUnique({ where: { email }, include: { vendorProfile: true } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  if (user.status === UserStatus.SUSPENDED) return res.status(403).json({ message: 'Account suspended' });

  const payload = { sub: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  return res.json({ accessToken, refreshToken, user: sanitizeUser(user) });
}

export async function refresh(req: Request, res: Response) {
  const { token } = req.body as { token: string };
  if (!token) return res.status(400).json({ message: 'Missing token' });
  try {
    const payload = verifyRefreshToken(token);
    const accessToken = signAccessToken({ sub: payload.sub, role: payload.role });
    const refreshToken = signRefreshToken({ sub: payload.sub, role: payload.role });
    return res.json({ accessToken, refreshToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}

export async function currentUser(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    include: { vendorProfile: true },
  });
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user: sanitizeUser(user) });
}


