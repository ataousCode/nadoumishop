"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class AuthRepository {
    async createRefreshToken(data) {
        return prisma.refreshToken.create({ data });
    }
    async findRefreshToken(token) {
        return prisma.refreshToken.findUnique({ where: { token } });
    }
    async updateRefreshToken(id, data) {
        return prisma.refreshToken.update({ where: { id }, data });
    }
    async revokeRefreshToken(token) {
        return prisma.refreshToken.update({
            where: { token },
            data: { revoked: true },
        });
    }
}
exports.AuthRepository = AuthRepository;
//# sourceMappingURL=auth.repository.js.map