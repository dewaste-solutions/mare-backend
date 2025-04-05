import { sql } from "drizzle-orm";
import { db } from "../src/db";
import {
	permissions,
	rolePermissionConnection,
	roles,
} from "../src/db/schema/auth";

export async function seedAuthRole() {
	await db.transaction(async (tx) => {
		await tx.insert(roles).values([
			{ name: "guest", updatedAt: sql`NOW()` },
			{ name: "admin", updatedAt: sql`NOW()` },
			{ name: "community", updatedAt: sql`NOW()` },
			{ name: "franchise", updatedAt: sql`NOW()` },
			{ name: "manager", updatedAt: sql`NOW()` },
			{ name: "worker", updatedAt: sql`NOW()` },
		]);

		const insertedRoles = await tx.select().from(roles);
		const roleMap = Object.fromEntries(
			insertedRoles.map((role) => [role.name, role.id]),
		);

		await tx.insert(permissions).values([
			{
				description: "Can invite users with roles",
				scope: "create:invitation",
				updatedAt: sql`NOW()`,
			},
			{
				description: "Can read own profile",
				scope: "read:profile",
				updatedAt: sql`NOW()`,
			},
			{
				description: "Can generate access token",
				scope: "generate:access-token",
				updatedAt: sql`NOW()`,
			},
			{
				description: "Can read roles",
				scope: "read:roles",
				updatedAt: sql`NOW()`,
			},
		]);

		const insertedPermissions = await tx.select().from(permissions);
		const permissionMap = Object.fromEntries(
			insertedPermissions.map((perm) => [perm.scope, perm.id]),
		);

		// Assign public permissions to all roles
		const publicPermissions = ["read:profile", "generate:access-token"];
		const publicRolePermissions = insertedRoles
			.filter((role) => role.name !== "guest")
			.flatMap((role) =>
				publicPermissions.map((perm) => ({
					roleId: role.id,
					permissionId: permissionMap[perm],
				})),
			);
		await tx.insert(rolePermissionConnection).values(publicRolePermissions);

		// Assign admin-only permission
		if (roleMap.admin) {
			const adminOnlyPermissions = ["create:invitation", "read:roles"];

			const adminRolePermissions = adminOnlyPermissions.map((scope) => ({
				roleId: roleMap.admin,
				permissionId: permissionMap[scope],
			}));
			await tx.insert(rolePermissionConnection).values(adminRolePermissions);
		}
	});
}
