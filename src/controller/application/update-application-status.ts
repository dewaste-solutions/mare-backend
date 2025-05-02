import { eq, sql } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { db } from "../../db";
import { onBoarding, invitedUsers } from "../../db/schema/application";
import { statuses } from "../../db/schema/shared";
import { sendApplicationStatusEmail } from "../../helper/nodemailer/template/application-status";

export const updateApplicationStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const onboardingId = req.query.onboardingId as string | undefined;
        const status = req.query.status as string | undefined;

        if (!onboardingId) {
            res.status(400).json({ message: "onboardingId is required." });
            return;
        }

        if (!status || !["accepted", "declined"].includes(status)) {
            res.status(400).json({ message: "Status must be either 'accepted' or 'declined'." });
            return;
        }

        await db.transaction(async (tx) => {
            // Get the status ID
            const statusResult = await tx
                .select({ id: statuses.id })
                .from(statuses)
                .where(eq(statuses.name, status));

            if (statusResult.length === 0) {
                throw new Error(`Status '${status}' not found.`);
            }

            // Get the invited user's email and first name
            const invitedUserResult = await tx
                .select({
                    email: invitedUsers.email,
                })
                .from(invitedUsers)
                .innerJoin(onBoarding, eq(onBoarding.invitedUsersId, invitedUsers.id))
                .where(eq(onBoarding.id, onboardingId));

            if (invitedUserResult.length === 0) {
                throw new Error("Invited user not found.");
            }

            // Update the onboarding status
            await tx
                .update(onBoarding)
                .set({
                    statusId: statusResult[0].id,
                    updatedAt: sql`NOW()`,
                })
                .where(eq(onBoarding.id, onboardingId));

            // Send email notification
            await sendApplicationStatusEmail({
                to: invitedUserResult[0].email,
                status: status as "accepted" | "declined",
            });
        });

        res.status(200).json({
            message: `Application ${status} successfully.`,
        });
        return;
    } catch (error) {
        next(error);
    }
}; 