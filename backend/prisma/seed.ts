import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      password: passwordHash,
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  // Create Vendor user + profile
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      name: 'Sample Vendor',
      email: 'vendor@example.com',
      password: passwordHash,
      role: 'VENDOR',
      status: 'ACTIVE',
    },
  });

  await prisma.vendorProfile.upsert({
    where: { userId: vendorUser.id },
    update: {},
    create: {
      userId: vendorUser.id,
      storeName: 'Vendor Store',
    },
  });

  // Categories
  const categoryData = [
    { id: 'cat-electronics', name: 'Electronics', parentId: null },
    { id: 'cat-phones', name: 'Mobile Phones', parentId: 'cat-electronics' },
    { id: 'cat-computers', name: 'Computers & Accessories', parentId: 'cat-electronics' },
    { id: 'cat-fashion', name: 'Clothing & Fashion', parentId: null },
    { id: 'cat-men-fashion', name: "Men's Fashion", parentId: 'cat-fashion' },
    { id: 'cat-women-fashion', name: "Women's Fashion", parentId: 'cat-fashion' },
    { id: 'cat-home', name: 'Home & Appliances', parentId: null },
    { id: 'cat-kitchen', name: 'Kitchen Appliances', parentId: 'cat-home' },
    { id: 'cat-beauty', name: 'Beauty & Health', parentId: null },
    { id: 'cat-groceries', name: 'Groceries', parentId: null },
  ];

  for (const category of categoryData) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name, parentId: category.parentId || null },
      create: category,
    });
  }

  // Products
  const vendorProfile = await prisma.vendorProfile.findUniqueOrThrow({ where: { userId: vendorUser.id } });
  const products = [
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-phones',
      title: 'Samsung Galaxy A55',
      description: '6.6" AMOLED display, 8GB RAM, 128GB storage, 5000mAh battery',
      price: 1899.0,
      stock: 75,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1510554310709-8571e91b1965?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Samsung',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-phones',
      title: 'iPhone 15 Pro',
      description: 'Dynamic Island, A17 Pro chip, 128GB storage, triple camera system',
      price: 7399.0,
      stock: 30,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Apple',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-computers',
      title: 'HP Pavilion 15',
      description: '15.6" FHD, Intel Core i7, 16GB RAM, 512GB SSD, Windows 11',
      price: 3899.0,
      stock: 40,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'HP',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-men-fashion',
      title: "Men's Tailored Suit",
      description: 'Slim fit suit set with blazer, trousers and waistcoat',
      price: 749.0,
      stock: 120,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Accra Tailors',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-women-fashion',
      title: 'Ankara Print Dress',
      description: 'Vibrant African print midi dress with matching headwrap',
      price: 299.0,
      stock: 60,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Adinkra Styles',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-kitchen',
      title: 'Binatone Stand Mixer',
      description: '5-speed stand mixer with stainless steel bowl and dough hooks',
      price: 459.0,
      stock: 55,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1583225272824-6551e1a68c9b?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Binatone',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-beauty',
      title: 'Shea Butter Glow Kit',
      description: 'Pure shea butter moisturizer set with body oil and scrub',
      price: 189.0,
      stock: 150,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'Essence GH',
    },
    {
      vendorId: vendorProfile.id,
      categoryId: 'cat-groceries',
      title: 'Fresh Fruit Basket',
      description: 'Assorted Ghanaian fruits: pineapples, mangoes, bananas and oranges',
      price: 129.0,
      stock: 80,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1502741126161-b048400d0857?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      brand: 'FarmFresh GH',
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({ where: { title: product.title } });
    if (existing) {
      await prisma.product.update({ where: { id: existing.id }, data: product });
    } else {
      await prisma.product.create({ data: product });
    }
  }

  console.log('Seed completed:', { admin: admin.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


