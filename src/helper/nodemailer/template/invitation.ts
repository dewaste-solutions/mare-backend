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
	const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>You're Invited to Join Dewaste Solution!</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          text-align: center;
        }
        .header {
          color: #007bff;
          font-size: 24px;
          font-weight: bold;
        }
        .role-box {
          display: inline-block;
          background: #007bff;
          color: #fff;
          padding: 8px 16px;
          font-size: 16px;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 10px;
        }
        .btn {
          display: inline-block;
          padding: 12px 20px;
          margin: 20px 0;
          background: #28a745;
          color: #fff;
          text-decoration: none;
          font-size: 18px;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          font-size: 12px;
          color: #999;
          padding-top: 20px;
          border-top: 1px solid #ddd;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <p class="header">You're Invited to Join Dewaste Solution!</p>
        <p>Hello,</p>
        <p>You have been invited to join <strong>Dewaste Solution</strong> as a:</p>
        <div class="role-box">${role}</div>
        <p>Click the button below to complete your registration.</p>
        <a href="${invitationLink}" class="btn">Accept Invitation</a>
        <p>If you did not request this, please ignore this email.</p>
        <div class="footer">
          <p>© 2024 Dewaste Solution. All rights reserved.</p>
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
