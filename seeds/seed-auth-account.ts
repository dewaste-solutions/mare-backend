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
				email: "guest@mare.com",
				role: "guest",
			},
			{
				firstName: "adminF",
				lastName: "adminL",
				email: "admin@mare.com",
				role: "admin",
			},
			{
				firstName: "communityF",
				lastName: "communityL",
				email: "community@mare.com",
				role: "community",
			},
			{
				firstName: "franchiseF",
				lastName: "franchiseL",
				email: "franchise@mare.com",
				role: "franchise",
			},
			{
				firstName: "managerF",
				lastName: "managerL",
				email: "manager@mare.com",
				role: "manager",
			},
			{
				firstName: "workerF1",
				lastName: "workerL1",
				email: "waste.worker1@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF2",
				lastName: "workerL2",
				email: "waste.worker2@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF3",
				lastName: "workerL3",
				email: "waste.worker3@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF4",
				lastName: "workerL4",
				email: "waste.worker4@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF5",
				lastName: "workerL5",
				email: "waste.worker5@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF6",
				lastName: "workerL6",
				email: "waste.worker6@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF7",
				lastName: "workerL7",
				email: "waste.worker7@mare.com",
				role: "worker",
			},
			{
				firstName: "workerF8",
				lastName: "workerL8",
				email: "waste.worker8@mare.com",
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
