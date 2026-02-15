import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import logger from "../../../utils/logger";
import { env } from "../../../config/env";

export class EmailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  }

  private async loadTemplate(
    templateName: string,
    context: any,
  ): Promise<string> {
    const templatePath = path.join(
      __dirname,
      "email.templates",
      `${templateName}.template.hbs`,
    );

    try {
      const source = fs.readFileSync(templatePath, "utf8");
      const template = handlebars.compile(source);
      return template(context);
    } catch (error) {
      logger.error(`Error loading template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ) {
    try {
      const html = await this.loadTemplate(templateName, context);
      logger.info(`Sending email to ${to} with template ${templateName}...`);

      const info = await this.transporter.sendMail({
        from: `"${env.APP_NAME}" <${env.EMAIL_FROM}>`,
        to,
        subject,
        html,
      });

      logger.info(`Email sent: ${info.messageId}`);
      return info;
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}
