import express, { Express } from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import cookieParser from "cookie-parser";

import { globalErrorHandler } from "./middlewares/error.middleware";
import { AppError } from "./utils/AppError";
import { env } from "./config/env";

// Import Routes
// Import Centralized Routes
import routes from "./routes";

const app: Express = express();

// 1) GLOBAL MIDDLEWARES
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
import logger from "./utils/logger";

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.http(JSON.stringify(logObject));
      },
    },
  }),
);

// 2) ROUTES
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1", routes);

// 3) UNHANDLED ROUTES
app.all(/(.*)/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 4) GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
