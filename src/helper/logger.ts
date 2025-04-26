import winston from "winston";

const { combine, timestamp, colorize, printf } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

export const logger = winston.createLogger({
	level: "info",
	format: combine(timestamp(), colorize({ all: true }), customFormat),
	transports: [new winston.transports.Console()],
});

// logger.error('error');
// logger.warn('warn');
// logger.info('info');
// logger.verbose('verbose');
// logger.debug('debug');
// logger.silly('silly');
