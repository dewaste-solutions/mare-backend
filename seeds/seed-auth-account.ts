import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "../src/db";
import { profiles, roles, users } from "../src/db/schema/auth";
import { wasteCollectors } from "../src/db/schema/workers";

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

		for (let i = 0; i < userEntries.length; i++) {
			const user = userEntries[i];

			// Create user
			const newUser = await tx
				.insert(users)
				.values({
					firstName: user.firstName,
					lastName: user.lastName,
					email: user.email,
					encryptedPassword: passwords[i],
					roleId: roleMap[user.role],
					updatedAt: sql`NOW()`,
				})
				.returning({
					id: users.id,
				})
				.onConflictDoNothing();

			if (newUser && newUser.length > 0) {
				// Create profile for each user
				await tx
					.insert(profiles)
					.values({
						userId: newUser[0].id,
						updatedAt: sql`NOW()`,
					})
					.onConflictDoNothing();

				// Create waste collector record for workers
				if (user.role === "worker") {
					await tx
						.insert(wasteCollectors)
						.values({
							userId: newUser[0].id,
							updatedAt: sql`NOW()`,
						})
						.onConflictDoNothing();
				}
			}
		}
	});

	const result = await db.select({ email: users.email }).from(users);

	return result;
}
