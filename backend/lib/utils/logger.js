import winston from "winston";
import path from "path";
import "winston-daily-rotate-file";

// Ensure the logs directory exists
const logDirectory = path.resolve("logs");

// Activity Logger: For general activity logs
const activityLogger = winston.createLogger({
  level: "info", // Only log info-level messages
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} | Level: ${level.toUpperCase()} | ${message}`
    )
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "activity-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d", // Retain logs for 7 days
    }),
  ],
});

// Error Logger: For error logs only
const errorLogger = winston.createLogger({
  level: "error", // Only log error-level messages
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} | Level: ${level.toUpperCase()} | ${message}`
    )
  ),
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDirectory, "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxFiles: "7d", // Retain logs for 7 days
    }),
  ],
});

// Helper function to log activity
const logActivity = (action, userId, taskId, details = "") => {
  const message = `Action: ${action} | User: ${userId} | Task: ${taskId} | Details: ${details}`;
  activityLogger.info(message); // Write to activity log only
};

// Helper function to log errors
const logError = (errorMessage, userId = null, taskId = null, details = "") => {
  const message = `Error: ${errorMessage} | User: ${userId || "N/A"} | Task: ${
    taskId || "N/A"
  } | Details: ${details}`;
  errorLogger.error(message); // Write to error log only
};

export { logActivity, logError };
