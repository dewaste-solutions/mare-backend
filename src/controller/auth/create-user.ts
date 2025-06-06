import bcrypt from "bcryptjs";
import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import * as HttpStatusCodes from "../../constant/http-status-codes";
import * as HttpStatusPhrases from "../../constant/http-status-phrases";
import { db } from "../../db";
import { roles, users } from "../../db/schema/auth";

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		const { email, password, firstName, lastName } = req.body;

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

		const hashedPassword = await bcrypt.hash(password, 10);
		if (!hashedPassword) {
			res
				.status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
				.json({ message: HttpStatusPhrases.INTERNAL_SERVER_ERROR });
			return;
		}

		const role = await db
			.select({ id: roles.id })
			.from(roles)
			.where(eq(roles.name, "guest"))
			.limit(1);
		if (role.length === 0) {
			res
				.status(HttpStatusCodes.NOT_FOUND)
				.json({ message: HttpStatusPhrases.NOT_FOUND });
			return;
		}

		const roleId = role[0].id;

		const newUser = await db
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

		res
			.status(HttpStatusCodes.CREATED)
			.json({ message: HttpStatusPhrases.CREATED });
		return;
	} catch (error) {
		next(error);
	}
}
