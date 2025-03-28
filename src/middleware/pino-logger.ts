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
 * Custom Morgan token to get request headers (for debugging).
 */
morgan.token("req-headers", (req) => {
	return JSON.stringify(req.headers || {});
});

/**
 * Custom Morgan token to get query parameters (for debugging).
 */
morgan.token("req-query", (req) => {
	const request = req as Request;
	return JSON.stringify(request.query || {});
});

/**
 * Custom Morgan token to get User-Agent header.
 */
morgan.token("user-agent", (req) => req.headers["user-agent"] || "Unknown");

/**
 * Custom Morgan token to get response content length.
 */
morgan.token("res-content-length", (_req, res) =>
	String(res.getHeader("content-length") || "0"),
);

/**
 * Custom Morgan token to get response status message.
 */
morgan.token("status-message", (_req, res) => res.statusMessage || "-");

export function httpLogger() {
	return morgan((tokens, req, res) => {
		const statusCode = Number.parseInt(tokens.status(req, res) || "0");
		let statusLabel = "";
		if (statusCode >= 500) statusLabel = "[ERROR]";
		else if (statusCode >= 400) statusLabel = "[WARN]";
		else if (statusCode >= 300) statusLabel = "[REDIRECT]";
		else if (statusCode >= 200) statusLabel = "[SUCCESS]";
		else statusLabel = "[INFO]";

		const logMessage = `[HTTP] ${tokens.date(req, res, "iso")} | ${tokens.method(req, res)} | ${tokens.url(req, res)} | ${statusLabel} ${statusCode} | ${tokens["response-time"](req, res)} ms`;

		const requestBody = tokens["req-body"](req, res);
		const requestHeaders = tokens["req-headers"](req, res);
		const requestQuery = tokens["req-query"](req, res);
		const userAgent = tokens["user-agent"](req, res);
		const responseSize = tokens["res-content-length"](req, res);

		const logBox = `--+start+--\n${logMessage}\n${requestBody !== "{}" ? `Request Body: ${requestBody}` : ""}\nHeaders: ${requestHeaders}\n${requestQuery !== "{}" ? `Query Params: ${requestQuery}` : ""}\nUser-Agent: ${userAgent}\nResponse Size: ${responseSize} bytes\n--+end+--`;

		// biome-ignore lint/suspicious/noConsole:
		console.log(logBox);

		return null;
	});
}
