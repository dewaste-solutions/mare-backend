import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { profiles, roles, users } from "../../db/schema/auth";
import { wasteCollectors } from "../../db/schema/workers";

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { email, password, firstName, lastName, roleName } = req.body;

		// check if the email is the existed
		const existingUser = await db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		if (existingUser.length > 0) {
			res
				.status(HttpStatusCodes.CONFLICT)
				.json({ message: HttpStatusPhrases.CONFLICT });
			return;
		}

		// getting default role "guest"
		const role = await db
			.select({ id: roles.id })
			.from(roles)
			.where(eq(roles.name, roleName))
			.limit(1);
		if (role.length === 0) {
			res
				.status(HttpStatusCodes.NOT_FOUND)
				.json({ message: HttpStatusPhrases.NOT_FOUND });
			return;
		}
		const roleId = role[0].id;

		// encrypting password
		const hashedPassword = await bcrypt.hash(password, 10);
		if (!hashedPassword) {
			res
				.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
			return;
		}

		// create 2/3 table
		await db.transaction(async (tx) => {
			const newUser = await tx
				.insert(users)
				.values({
					firstName,
					lastName,
					email,
					updatedAt: sql`NOW()`,
					encryptedPassword: hashedPassword,
					roleId: roleId,
				})
				.returning({
					id: users.id,
					email: users.email,
					first_name: users.firstName,
					last_name: users.lastName,
					role_id: users.roleId,
				});
			if (newUser.length === 0) {
				res
					.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
					.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
				return;
			}

			const newProfile = await tx
				.insert(profiles)
				.values({
					userId: newUser[0].id,
					updatedAt: sql`NOW()`,
				})
				.returning({ id: profiles.id });
			if (newProfile.length === 0) {
				res
					.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
					.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
				return;
			}

			// for worker user
			if (roleName === "worker") {
				const newWasteCollector = await tx
					.insert(wasteCollectors)
					.values({
						userId: newUser[0].id,
						updatedAt: sql`NOW()`,
					})
					.returning({ id: wasteCollectors.id });
				if (newWasteCollector.length === 0) {
					res
						.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
						.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
					return;
				}
			}
		});

		res
			.status(HttpStatusCodes.CREATED)
			.json({ message: HttpStatusPhrases.CREATED });
		return;
	} catch (error) {
		next(error);
	}
}
