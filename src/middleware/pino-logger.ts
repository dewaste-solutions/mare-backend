import chalk from "chalk";
import type { Request } from "express";
import morgan from "morgan";

/**
 * Custom Morgan token to get request body (for debugging).
 */
morgan.token("req-body", (req) => {
	const request = req as Request;
	try {
		return JSON.stringify(request.body || {});
	} catch (_error) {
		return "{}"; // Prevent JSON parsing errors
	}
});

/**
 * Custom Morgan token to get response status message.
 */
morgan.token("status-message", (_req, res) => res.statusMessage || "-");

export function httpLogger() {
	return morgan((tokens, req, res) => {
		const statusCode = Number.parseInt(tokens.status(req, res) || "0");
		let statusColor = chalk.gray;
		if (statusCode >= 500) statusColor = chalk.red.bold;
		else if (statusCode >= 400) statusColor = chalk.yellow.bold;
		else if (statusCode >= 300) statusColor = chalk.cyan;
		else if (statusCode >= 200) statusColor = chalk.green.bold;

		const logMessage = [
			chalk.blue.bold("[HTTP]"),
			chalk.gray(tokens.date(req, res, "iso")),
			chalk.cyan(tokens.method(req, res)),
			chalk.yellow(tokens.url(req, res)),
			statusColor(statusCode),
			chalk.gray(`${tokens["response-time"](req, res)} ms`),
		].join(" | ");

		const requestBody = tokens["req-body"](req, res);
		const logBox = `
${chalk.magenta("------------------------------------------------------------------------------------------------------------------------")}
${logMessage}
${requestBody !== "{}" ? `${chalk.gray("Request Body:")} ${requestBody}` : ""}
${chalk.magenta("------------------------------------------------------------------------------------------------------------------------")}
    `;

		// biome-ignore lint/suspicious/noConsole:
		console.log(logBox);

		return null;
	});
}
