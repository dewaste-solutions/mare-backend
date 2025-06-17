import express from "express";

import { getCurrentDate } from "../controller/shared/get-current-date";
import { RateLimitCategory, applyRateLimit } from "../middleware/rate-limit";

export const sharedRoute = express.Router();

/**
 * @openapi
 * /api/shared/get-current-date:
 *   get:
 *     summary: Get server's current date and timezone
 *     description: |
 *       Retrieves the current server timestamp and timezone configuration.
 *       Useful for synchronizing client-side time with server time and
 *       handling timezone-sensitive operations.
 *
 *       Required Permission:
 *       - none
 *
 *     tags:
 *       - Shared
 *     responses:
 *       200:
 *         description: Successfully retrieved current date and timezone
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OK"
 *                 data:
 *                   type: object
 *                   properties:
 *                     currentDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-10T15:30:00.000Z"
 *                     timeZone:
 *                       type: string
 *                       example: "UTC"
 *             example:
 *               message: "OK"
 *               data:
 *                 currentDate: "2025-06-10T15:30:00.000Z"
 *                 timeZone: "UTC"
 */
sharedRoute.get(
	"/get-current-date",
	applyRateLimit(RateLimitCategory.LENIENT),
	getCurrentDate,
);
