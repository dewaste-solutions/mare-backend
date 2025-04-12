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
				firstName: "Guest",
				lastName: "User",
				email: "guest@example.com",
				role: "guest",
			},
			{
				firstName: "Admin",
				lastName: "User",
				email: "admin@example.com",
				role: "admin",
			},
			{
				firstName: "Community",
				lastName: "Manager",
				email: "community@example.com",
				role: "community",
			},
			{
				firstName: "Franchise",
				lastName: "Owner",
				email: "franchise@example.com",
				role: "franchise",
			},
			{
				firstName: "Project",
				lastName: "Manager",
				email: "manager@example.com",
				role: "manager",
			},
			{
				firstName: "Worker",
				lastName: "Employee",
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
