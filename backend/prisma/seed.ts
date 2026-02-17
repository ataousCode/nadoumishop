import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import logger from "../src/utils/logger";
import bcrypt from "bcrypt";

async function main() {
  logger.info("Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.address.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@nadoumishop.com",
      password: adminPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

  // Create Categories
  const electronics = await prisma.category.create({
    data: { name: "electronics" },
  });
  const clothing = await prisma.category.create({
    data: { name: "clothing" },
  });
  const home = await prisma.category.create({
    data: { name: "home" },
  });

  // Create Products
  await prisma.product.createMany({
    data: [
      {
        name: "Wireless Headphones",
        description: "High quality noise cancelling headphones.",
        price: 99.99,
        stock: 50,
        categoryId: electronics.id,
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
        ],
        discount: 10,
        isBestSeller: true,
      },
      {
        name: "Smartphone X",
        description: "Latest model with high resolution camera.",
        price: 699.99,
        stock: 20,
        categoryId: electronics.id,
        images: [
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
        ],
        isNewArrival: true,
      },
      {
        name: "Cotton T-Shirt",
        description: "Comfortable organic cotton t-shirt.",
        price: 19.99,
        stock: 100,
        categoryId: clothing.id,
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
        ],
      },
      {
        name: "Smart Coffee Maker",
        description: "WiFi enabled coffee maker.",
        price: 89.99,
        stock: 15,
        categoryId: home.id,
        images: [
          "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&q=80",
        ],
        discount: 20,
      },
      {
        name: "Gaming Laptop",
        description: "High performance gaming laptop.",
        price: 1299.99,
        stock: 5,
        categoryId: electronics.id,
        images: [
          "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80",
        ],
        isNewArrival: true,
      },
      {
        name: "Running Shoes",
        description: "Lightweight running shoes.",
        price: 49.99,
        stock: 30,
        categoryId: clothing.id,
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
        ],
      },
    ],
  });

  logger.info("Seeding completed");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
