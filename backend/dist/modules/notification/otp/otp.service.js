"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpService = void 0;
class OtpService {
    static generate() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        return { otp, expires };
    }
}
exports.OtpService = OtpService;
//# sourceMappingURL=otp.service.js.map