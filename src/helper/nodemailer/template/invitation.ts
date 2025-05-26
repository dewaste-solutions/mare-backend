import path from "node:path";
import { transporter } from "../../../config/nodemailer";
import { env } from "../../../env";
import { communityOfficerHtmlContent } from "./html/community-officer";
import { franchiseeHtmlContent } from "./html/franchisee";

export const sendInvitationEmail = async ({
	to,
	role,
	invitationLink,
}: {
	to: string;
	role: string;
	invitationLink: string;
}) => {
	const currentYear = new Date().getFullYear();
	const logoPath = path.join(__dirname, "img", "logo.png");

	let htmlContent = "";

	// guest admin community franchise manager worker
	if (role === "community") {
		htmlContent = communityOfficerHtmlContent({
			invitationLink,
			currentYear,
		});
	} else if (role === "franchise") {
		htmlContent = franchiseeHtmlContent({
			invitationLink,
			currentYear,
		});
	} else {
		throw new Error("Invalid role");
	}
	await transporter.sendMail({
		from: {
			name: "Dewaste Solution",
			address: env.BACKEND_NODEMAILER_EMAIL,
		},
		to,
		subject: "You're Invited to Join Dewaste Solution!",
		html: htmlContent,
		attachments: [
			{
				filename: "logo.png",
				path: logoPath,
				cid: "logo",
			},
		],
	});
};
