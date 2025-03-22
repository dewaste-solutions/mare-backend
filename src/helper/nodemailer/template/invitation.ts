import { transporter } from "../../../config/nodemailer";
import { env } from "../../../env";

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

	const htmlContent = `
	<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invitation to Join Dewaste Solution</title>
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
              background: #43c466;
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
          .btn {
              display: inline-block;
              background: #43c466;
              color: white;
              text-decoration: none;
              padding: 12px 20px;
              border-radius: 5px;
              font-size: 16px;
              font-weight: bold;
              margin-top: 20px;
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
              You're Invited to Dewaste Solution!
          </div>
          <div class="content">
              <p>You have been invited to join <strong>Dewaste Solution</strong> as a <strong>${role}</strong>.</p>
              <p>Click the button below to accept your invitation. You will be redirected to the Dewaste Solution application to complete the necessary requirements.</p>
              <a href="${invitationLink}" class="btn">Accept Invitation</a>
              <p>If you have any questions, feel free to reach out to us.</p>
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
		subject: "You're Invited to Join Dewaste Solution!",
		html: htmlContent,
	});
};
