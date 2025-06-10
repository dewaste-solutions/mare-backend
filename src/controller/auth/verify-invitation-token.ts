import { and, eq, gt, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { invitedUsers } from "../../db/schema/application";
import { oneTimeTokens } from "../../db/schema/auth";

export async function verifyInvitationToken(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const invitationToken = req.query.invitationToken as string | undefined;

		if (!invitationToken) {
			res
				.status(HttpStatusCodes.BAD_REQUEST)
				.json({ message: HttpStatusPhrases.BAD_REQUEST });
			return;
		}

		const nowResult = await db.execute(sql`SELECT NOW() AS current_timestamp`);
		const now = new Date(nowResult.rows[0].current_timestamp as string);

		const token = await db
			.select({ id: oneTimeTokens.id, revoked: oneTimeTokens.revoked })
			.from(oneTimeTokens)
			.where(
				and(
					eq(oneTimeTokens.tokenHash, invitationToken),
					gt(oneTimeTokens.notAfter, now),
				),
			)
			.limit(1);

		if (token.length === 0 || token[0].revoked) {
			res
				.status(HttpStatusCodes.UNAUTHORIZED)
				.json({ message: HttpStatusPhrases.UNAUTHORIZED });
			return;
		}

		await db
			.update(oneTimeTokens)
			.set({ updatedAt: sql`NOW()` })
			.where(eq(oneTimeTokens.id, token[0].id));

		const invitedUserResult = await db
			.select({ invitedUsersId: invitedUsers.id })
			.from(invitedUsers)
			.where(and(eq(invitedUsers.oneTimeTokensId, token[0].id)));

		res.status(HttpStatusCodes.OK).json({
			message: HttpStatusPhrases.OK,
			data: { invitedUsersId: invitedUserResult[0].invitedUsersId },
		});
		return;
	} catch (error) {
		next(error);
	}
}
