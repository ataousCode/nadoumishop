import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User; // Customize the User type based on your Prisma model
    }
  }
}
