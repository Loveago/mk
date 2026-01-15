import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@myghanamarketplace.local';
  const adminPwd = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = await bcrypt.hash(adminPwd, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash: adminHash, role: 'ADMIN', status: 'ACTIVE' }
  });

  const categories = [
    { name: 'Electronics', slug: 'electronics' },
    { name: 'Fashion', slug: 'fashion' },
    { name: 'Home & Office', slug: 'home-office' },
    { name: 'Appliances', slug: 'appliances' },
    { name: 'Computing', slug: 'computing' },
    { name: 'Sports & Outdoors', slug: 'sports-outdoors' },
    { name: 'Baby Products', slug: 'baby-products' },
    { name: 'Gaming', slug: 'gaming' }
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // sample approved vendor
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      passwordHash: await bcrypt.hash('vendor123', 10),
      role: 'VENDOR',
      status: 'ACTIVE',
      vendorProfile: { create: { companyName: 'Vendor Co', displayName: 'VendorCo', approvedAt: new Date() } }
    }
  });

  const electronics = await prisma.category.findUnique({ where: { slug: 'electronics' } });
  if (electronics) {
    await prisma.product.upsert({
      where: { slug: 'smartphone-xyz' },
      update: {},
      create: {
        name: 'Smartphone XYZ',
        slug: 'smartphone-xyz',
        description: 'Sample smartphone',
        price: 1500,
        currency: 'GHS',
        stockQty: 50,
        categoryId: electronics.id,
        vendorId: vendor.id,
        images: JSON.stringify([{ url: '/images/smartphone.jpg', alt: 'Smartphone' }])
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.log('Seed complete');
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });


