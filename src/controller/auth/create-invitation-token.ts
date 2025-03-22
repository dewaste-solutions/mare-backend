import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../../db";
import { oneTimeTokens, roles } from "../../db/schema/auth";
import { env } from "../../env";
import { sendInvitationEmail } from "../../helper/nodemailer/template/invitation";

export async function createInvitationToken(req: Request, res: Response) {
	try {
		const { roleId, emailTo } = req.body;

		const token = crypto.randomBytes(32).toString("hex");

		const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

		await db.transaction(async (tx) => {
			await tx.insert(oneTimeTokens).values({
				tokenHash: hashedToken,
				tokenType: "invitation",
				metadata: { roleId },
				updatedAt: sql`NOW()`,
				notAfter: sql`NOW() + INTERVAL '1 week'`,
			});
			const roleName = await tx
				.select({ name: roles.name })
				.from(roles)
				.where(eq(roles.id, roleId));

			try {
				await sendInvitationEmail({
					invitationLink: `${env.BACKEND_FRONTEND_URL}/application?invitationToken=${hashedToken}`,
					role: roleName[0].name,
					to: emailTo,
				});
			} catch (_error) {
				tx.rollback();
			}
		});

		res.status(201).json({ message: "One-time token created." });
		return;
	} catch (_error) {
		res.status(500).json({ message: "Internal server error" });
		return;
	}
}
