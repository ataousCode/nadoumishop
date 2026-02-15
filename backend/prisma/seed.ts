import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import logger from "../src/utils/logger";

async function main() {
  logger.info("Seeding database...");

  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  const electronics = await prisma.category.create({
    data: { name: "Electronics" },
  });

  const computers = await prisma.category.create({
    data: { name: "Computers" },
  });

  const books = await prisma.category.create({
    data: { name: "Books" },
  });

  logger.info(
    "Created categories:",
    electronics.name,
    computers.name,
    books.name,
  );

  // Create Products
  const product1 = await prisma.product.create({
    data: {
      name: "Smartphone X",
      description: "Latest model with high-res camera",
      price: 999.99,
      stock: 50,
      images: ["https://example.com/phone.jpg"],
      categoryId: electronics.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      name: "Laptop Pro",
      description: "High performance laptop for professionals",
      price: 1999.99,
      stock: 30,
      images: ["https://example.com/laptop.jpg"],
      categoryId: computers.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      name: "Wireless Earbuds",
      description: "Noise cancelling earbuds",
      price: 149.99,
      stock: 100,
      images: ["https://example.com/earbuds.jpg"],
      categoryId: electronics.id,
    },
  });

  logger.info("Created products:", product1.name, product2.name, product3.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
