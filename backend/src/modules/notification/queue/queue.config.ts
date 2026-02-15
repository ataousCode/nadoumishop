import { env } from "../../../config/env";

export const connection = {
  host: env.REDIS_HOST,
  port: Number(env.REDIS_PORT),
};

import logger from "../../../utils/logger";

logger.info("Redis Connection Config:", connection);
