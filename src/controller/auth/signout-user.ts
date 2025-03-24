import { eq } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../../db";
import { refreshTokens, sessions } from "../../db/schema/auth";
import { decryptToken } from "../../helper/auth/validate-token";

export const signoutUser = async (req: Request, res: Response) => {
	try {
		const token = req.cookies.refreshToken;

		// Check if token is present
		if (!token) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}

		// Decrypt token
		const decodeToken = await decryptToken(token);
		// Check if token is valid
		if (!decodeToken) {
			res.status(401).json({ message: "Invalid token" });
			return;
		}

		const tokenRecord = await db
			.select({
				sessionId: refreshTokens.sessionId,
				tokenId: refreshTokens.id,
			})
			.from(refreshTokens)
			.innerJoin(sessions, eq(refreshTokens.sessionId, sessions.id))
			.where(eq(refreshTokens.token, token))
			.limit(1);

		// Check if token is present
		if (tokenRecord.length === 0) {
			res.status(404).json({ message: "Token not found" });
			return;
		}

		await db
			.update(refreshTokens)
			.set({ revoked: true })
			.where(eq(refreshTokens.id, tokenRecord[0].tokenId));

		res.clearCookie("refreshToken");
		res.status(200).json({ message: "Signed out" });
		return;
	} catch (_error) {
		res.status(500).json({ message: "Internal server error" });
		return;
	}
};
