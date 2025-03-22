import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema/auth";

export async function seedAuthAccount() {
  await db.delete(users);

  // biome-ignore lint/suspicious/noConsole:
  console.log("seeding users");

  const hashPassword = async (password: string) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  };

  const data = await db
    .insert(users)
    .values([
      {
        firstName: "Guest",
        lastName: "User",
        email: "guest@example.com",
        encryptedPassword: await hashPassword("guest"),
        roleId: "94f3f25f-9b24-4c09-bea3-3f111e44af53", // Guest
        updatedAt: sql`NOW()`,
      },
      {
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        encryptedPassword: await hashPassword("admin"),
        roleId: "f7129912-48e8-4f03-8705-07907da83e26", // Admin
        updatedAt: sql`NOW()`,
      },
      {
        firstName: "Community",
        lastName: "Manager",
        email: "community@example.com",
        encryptedPassword: await hashPassword("community"),
        roleId: "c5729470-51e2-44f3-b891-372ecfdddf3c", // Community
        updatedAt: sql`NOW()`,
      },
      {
        firstName: "Franchise",
        lastName: "Owner",
        email: "franchise@example.com",
        encryptedPassword: await hashPassword("franchise"),
        roleId: "e2f7809b-928b-4899-aba6-40a7b35f30ca", // Franchise
        updatedAt: sql`NOW()`,
      },
      {
        firstName: "Project",
        lastName: "Manager",
        email: "manager@example.com",
        encryptedPassword: await hashPassword("manager"),
        roleId: "64f258de-113f-49b3-a71b-313f599afe8d", // Manager
        updatedAt: sql`NOW()`,
      },
      {
        firstName: "Worker",
        lastName: "Employee",
        email: "worker@example.com",
        encryptedPassword: await hashPassword("worker"),
        roleId: "38e6e185-3a13-4ffb-807b-92574f648ab9", // Worker
        updatedAt: sql`NOW()`,
      },
    ])
    .returning({ email: users.email });
  // biome-ignore lint/suspicious/noConsole:
  console.log("Users seeded successfully.");
  return data;
}
