import { transporter } from "../../../config/nodemailer";
import { env } from "../../../env";

export const sendApplicationStatusEmail = async ({
	to,
	status,
}: {
	to: string;
	status: "accepted" | "declined";
}) => {
	const currentYear = new Date().getFullYear();
	const statusText = status === "accepted" ? "Congratulations!" : "Application Update";
	const statusMessage = status === "accepted" 
		? "We are pleased to inform you that your application has been accepted!"
		: "We regret to inform you that your application has been declined.";

	const htmlContent = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Application Status Update</title>
		<style>
			body {
				font-family: Arial, sans-serif;
				background-color: #f4f4f4;
				margin: 0;
				padding: 0;
			}
			.container {
				max-width: 600px;
				background: #ffffff;
				margin: 20px auto;
				padding: 20px;
				border-radius: 8px;
				box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
				text-align: center;
			}
			.header {
				background: ${status === "accepted" ? "#43c466" : "#dc3545"};
				color: white;
				padding: 15px;
				font-size: 24px;
				font-weight: bold;
				border-top-left-radius: 8px;
				border-top-right-radius: 8px;
			}
			.content {
				padding: 20px;
				color: #333;
				font-size: 16px;
			}
			.footer {
				margin-top: 20px;
				font-size: 14px;
				color: #777;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				${statusText}
			</div>
			<div class="content">
				<p>${statusMessage}</p>
				${status === "accepted" 
					? "<p>Our team will be in touch with you shortly to discuss the next steps.</p>"
					: "<p>We appreciate your interest in our program and encourage you to apply again in the future.</p>"
				}
				<p>If you have any questions, please don't hesitate to contact us.</p>
				<p>Best regards,<br>Dewaste Solution Team</p>
			</div>
			<div class="footer">
				© ${currentYear} Dewaste Solution. All rights reserved.
			</div>
		</div>
	</body>
	</html>
	`;

	await transporter.sendMail({
		from: {
			name: "Dewaste Solution",
			address: env.BACKEND_NODEMAILER_EMAIL,
		},
		to,
		subject: `Application Status Update - ${statusText}`,
		html: htmlContent,
	});
}; 