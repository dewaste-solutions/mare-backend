import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { roles, users } from "../src/db/schema/auth";

export async function seedAuthAccount() {
	await db.transaction(async (tx) => {
		const roleResult = await tx.select().from(roles);

		const roleMap = Object.fromEntries(
			roleResult.map((role) => [role.name, role.id]),
		);

		const userEntries = [
			{
				firstName: "guestF",
				lastName: "guestL",
				email: "guest@example.com",
				role: "guest",
			},
			{
				firstName: "adminF",
				lastName: "adminL",
				email: "admin@example.com",
				role: "admin",
			},
			{
				firstName: "communityF",
				lastName: "communityL",
				email: "community@example.com",
				role: "community",
			},
			{
				firstName: "franchiseF",
				lastName: "franchiseL",
				email: "franchise@example.com",
				role: "franchise",
			},
			{
				firstName: "managerF",
				lastName: "managerL",
				email: "manager@example.com",
				role: "manager",
			},
			{
				firstName: "workerF",
				lastName: "workerL",
				email: "worker@example.com",
				role: "worker",
			},
		];

		const passwords = await Promise.all(
			userEntries.map((user) => bcrypt.hash(user.role, 10)),
		);

		const userData = userEntries.map((user, index) => ({
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			encryptedPassword: passwords[index],
			roleId: roleMap[user.role],
			updatedAt: sql`NOW()`,
		}));

		await tx.insert(users).values(userData).onConflictDoNothing();
	});

	const result = await db.select({ email: users.email }).from(users);

	return result;
}
