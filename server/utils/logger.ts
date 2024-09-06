import winston from "winston";

// Custom log levels with colors
const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const customColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to Winston
winston.addColors(customColors);

// Create a custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Create a custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels: customLevels,
  format: fileFormat,
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

// If we're not in production, log to the console with the custom format
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Optional: Create convenience methods for logging
export const logInfo = (message: string, meta?: any) =>
  logger.info(message, meta);
export const logError = (message: string, meta?: any) =>
  logger.error(message, meta);
export const logWarn = (message: string, meta?: any) =>
  logger.warn(message, meta);
export const logDebug = (message: string, meta?: any) =>
  logger.debug(message, meta);
export const logHttp = (message: string, meta?: any) =>
  logger.http(message, meta);
