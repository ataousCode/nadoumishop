import { User } from "@prisma/client";
import { prisma } from "../../config/prisma";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: any): Promise<User | any> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: any): Promise<User | any> {
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

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }
}
