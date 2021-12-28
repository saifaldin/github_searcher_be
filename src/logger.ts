import {
  createLogger, transports, format,
} from 'winston';

const customFormat = format.printf(({ level, message, timestamp }) => `${timestamp} ${level.toUpperCase()}: ${message}`);

const logger = createLogger({
  transports: [
    new transports.Console(),
  ],
  format: format.combine(
    format.timestamp(),
    customFormat,
  ),
});

export default logger;