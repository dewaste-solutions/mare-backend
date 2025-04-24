import { eq, sql, and } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { invitedUsers } from "../../db/schema/application";
import { oneTimeTokens, roles } from "../../db/schema/auth";
import { statuses } from "../../db/schema/shared";
import { env } from "../../env";

type RoleType = "admin" | "guest" | "franchise" | "worker" | "manager" | "community";

export async function getInvitedList(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const page = parseInt(req.query.page as string) || 1;
		const role = req.query.role as RoleType;
		const limit = 10;
		const offset = (page - 1) * limit;

		// Build base query conditions
		const conditions = [];
		if (role && ["admin", "guest", "franchise", "worker", "manager", "community"].includes(role)) {
			const roleResult = await db
				.select({ id: roles.id })
				.from(roles)
				.where(eq(roles.name, role))
				.limit(1);

			if (roleResult.length > 0) {
				conditions.push(eq(sql`CAST(${oneTimeTokens.metadata}->>'roleId' AS UUID)`, roleResult[0].id));
			}
		}

		const [totalCount, invitedList] = await Promise.all([
			db
				.select({ count: sql<number>`count(*)` })
				.from(invitedUsers)
				.leftJoin(oneTimeTokens, eq(invitedUsers.oneTimeTokensId, oneTimeTokens.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.then((result) => result[0].count),
			db
				.select({
					id: invitedUsers.id,
					status: statuses.name,
					email: invitedUsers.email,
					createdAt: invitedUsers.createdAt,
					updatedAt: invitedUsers.updatedAt,
				})
				.from(invitedUsers)
				.leftJoin(statuses, eq(invitedUsers.statusId, statuses.id))
				.leftJoin(oneTimeTokens, eq(invitedUsers.oneTimeTokensId, oneTimeTokens.id))
				.where(conditions.length > 0 ? and(...conditions) : undefined)
				.orderBy(sql`${invitedUsers.createdAt} DESC`)
				.limit(limit)
				.offset(offset),
		]);

		// Build pagination URLs
		const baseUrl = `${env.BASE_URL}/api/auth/invited-list`;
		const queryParams = new URLSearchParams();
		if (role) queryParams.set('role', role);
		
		const nextPage = page < Math.ceil(totalCount / limit) 
			? `${baseUrl}?page=${page + 1}&${queryParams.toString()}`
			: null;
		
		const previousPage = page > 1 
			? `${baseUrl}?page=${page - 1}&${queryParams.toString()}`
			: null;

		res.status(200).json({
			message: "Successfully retrieved invited list",
			data: {
				total: totalCount,
				next: nextPage,
				previous: previousPage,
				result: invitedList,
			},
		});
	} catch (error) {
		next(error);
	}
} 