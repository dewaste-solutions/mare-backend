import crypto from "node:crypto";
import { sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../../db";
import { oneTimeTokens } from "../../db/schema/auth";
import { sendInvitationEmail } from "../../helper/nodemailer/template/invitation";

export async function createInvitationToken(req: Request, res: Response) {
	try {
		const { roleId } = req.body;

		const token = crypto.randomBytes(32).toString("hex");

		const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

		await db.insert(oneTimeTokens).values({
			tokenHash: hashedToken,
			tokenType: "invitation",
			metadata: { roleId },
			updatedAt: sql`NOW()`,
			notAfter: sql`NOW() + INTERVAL '1 week'`,
		});

		res.status(201).json({ message: "One-time token created." });

		// TODO, create a transaction here when invitation is failed, then rollback the token creation
		await sendInvitationEmail({ invitationLink: "", role: "", to: "" });
		return;
	} catch (_error) {
		res.status(500).json({ message: "Internal server error" });
		return;
	}
}
