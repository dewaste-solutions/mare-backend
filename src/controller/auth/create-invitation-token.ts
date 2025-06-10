import crypto from "node:crypto";
import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { invitedUsers } from "../../db/schema/application";
import { oneTimeTokens, roles } from "../../db/schema/auth";
import { statuses } from "../../db/schema/shared";
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

			const invitationResult = await tx
				.insert(oneTimeTokens)
				.values({
					tokenHash: hashedToken,
					tokenType: "invitation",
					metadata: { roleId },
					updatedAt: sql`NOW()`,
					notAfter: sql`NOW() + INTERVAL '1 week'`,
				})
				.returning({ id: oneTimeTokens.id });

			const statusResult = await tx
				.select({ id: statuses.id })
				.from(statuses)
				.where(eq(statuses.name, "invited"));

			await tx.insert(invitedUsers).values({
				statusId: statusResult[0].id.toString(),
				oneTimeTokensId: invitationResult[0].id,
				email: emailTo,
				updatedAt: sql`NOW()`,
			});

			roleName = roleResult[0]?.name ?? null;

			await sendInvitationEmail({
				invitationLink: `${env.BACKEND_FRONTEND_URL}/application?invitationToken=${hashedToken}`,
				role: roleName,
				to: emailTo,
			});
		});

		res
			.status(HttpStatusCodes.CREATED)
			.json({ message: HttpStatusPhrases.CREATED });
	} catch (error) {
		next(error);
	}
}
