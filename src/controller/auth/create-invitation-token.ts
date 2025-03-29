import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { oneTimeTokens, roles } from "../../db/schema/auth";
import { env } from "../../env";
import { sendInvitationEmail } from "../../helper/nodemailer/template/invitation";

export async function createInvitationToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { roleId, emailTo } = req.body;

		const token = crypto.randomBytes(32).toString("hex");

		const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

		let roleName: string | null = null;

		await db.transaction(async (tx) => {
			const roleResult = await tx
				.select({ name: roles.name })
				.from(roles)
				.where(eq(roles.id, roleId))
				.for("update");

			if (roleResult.length === 0) {
				throw new Error("Invalid role ID.");
			}

			await tx.insert(oneTimeTokens).values({
				tokenHash: hashedToken,
				tokenType: "invitation",
				metadata: { roleId },
				updatedAt: sql`NOW()`,
				notAfter: sql`NOW() + INTERVAL '1 week'`,
			});

			roleName = roleResult[0]?.name ?? null;

			await sendInvitationEmail({
				invitationLink: `${env.BACKEND_FRONTEND_URL}/application?invitationToken=${hashedToken}`,
				role: roleName,
				to: emailTo,
			});
		});

		res.status(201).json({ message: "One-time token created." });
	} catch (error) {
		next(error);
	}
}
