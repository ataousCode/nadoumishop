import { PrismaClient } from "@prisma/client";
import logger from "../src/utils/logger";

const prisma = new PrismaClient();

async function promoteAdmin(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    logger.info(`User ${email} has been promoted to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
if (!email) {
  console.error(
    "Please provide an email address: npx ts-node scripts/promote-admin.ts user@example.com",
  );
  process.exit(1);
}

promoteAdmin(email);
