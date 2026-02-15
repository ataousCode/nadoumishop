import { PrismaClient, User, RefreshToken } from "@prisma/client";

const prisma = new PrismaClient();

export class AuthRepository {
  async createRefreshToken(data: {
    token: string;
    userId: string;
    expiresAt: Date;
    revoked?: boolean;
  }): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findRefreshToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async updateRefreshToken(id: string, data: any): Promise<RefreshToken> {
    return prisma.refreshToken.update({ where: { id }, data });
  }

  async revokeRefreshToken(token: string): Promise<RefreshToken> {
    return prisma.refreshToken.update({
      where: { token },
      data: { revoked: true },
    });
  }
}
