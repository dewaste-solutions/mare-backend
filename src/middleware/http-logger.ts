import type { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { logger } from "../helper/logger";

morgan.token("start", (req) => `<-- ${req.method} ${req.url}`);
morgan.token(
	"end",
	(req, res) =>
		`--> ${req.method} ${req.url} ${res.statusCode} ${res.getHeader("X-Response-Time") || "-"}ms`,
);

export function httpLogger() {
	return (req: Request, res: Response, next: NextFunction) => {
		logger.info(`<-- ${req.method} ${req.url}`);

		const start = process.hrtime();

		// Capture when response is finished
		res.on("finish", () => {
			const diff = process.hrtime(start);
			const time = Math.round(diff[0] * 1e3 + diff[1] * 1e-6);
			logger.info(`--> ${req.method} ${req.url} ${res.statusCode} ${time}ms`);
		});

		next();
	};
}
