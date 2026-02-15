"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class UserRepository {
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async create(data) {
        return prisma.user.create({ data });
    }
    async update(id, data) {
        return prisma.user.update({ where: { id }, data });
    }
    async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    async findByResetToken(tokenHash) {
        return prisma.user.findFirst({
            where: {
                passwordResetToken: tokenHash,
                passwordResetExpires: { gt: new Date() },
            },
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map