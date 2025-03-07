import type { NextFunction, Request, Response } from "express";
import { decryptToken } from "../../helper/validate-access-token";

export async function authenticateToken(
	req: Request,
	res: Response,
	next: NextFunction,
): Promise<void> {
	const authHeader = req.headers.authorization;
	const accessToken = authHeader?.split(" ")[1];

	if (!accessToken) {
		res.status(401).json({ message: "Unauthorized" });
		return;
	}

	const decodedUser = await decryptToken(accessToken);
	if (!decodedUser) {
		res.status(401).json({ message: "Invalid token" });
		return;
	}

	// verify the refresh token
	// check rabc role and permission

	next();
}
