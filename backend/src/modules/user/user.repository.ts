import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: any): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: any): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByResetToken(tokenHash: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: { gt: new Date() },
      },
    });
  }
}
