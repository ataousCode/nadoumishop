"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailProvider = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
class EmailProvider {
    transporter;
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }
    async loadTemplate(templateName, context) {
        const templatePath = path_1.default.join(__dirname, "email.templates", `${templateName}.template.hbs`);
        try {
            const source = fs_1.default.readFileSync(templatePath, "utf8");
            const template = handlebars_1.default.compile(source);
            return template(context);
        }
        catch (error) {
            console.error(`Error loading template ${templateName}:`, error);
            throw new Error(`Template ${templateName} not found`);
        }
    }
    async sendMail(to, subject, templateName, context) {
        try {
            const html = await this.loadTemplate(templateName, context);
            const info = await this.transporter.sendMail({
                from: `"${process.env.APP_NAME || "Nadoumi Shop"}" <${process.env.EMAIL_FROM}>`,
                to,
                subject,
                html,
            });
            console.log(`Email sent: ${info.messageId}`);
            return info;
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
exports.EmailProvider = EmailProvider;
//# sourceMappingURL=email.provider.js.map