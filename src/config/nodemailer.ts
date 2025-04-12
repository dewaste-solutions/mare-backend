import nodemailer from "nodemailer";
import { env } from "../env";

export const transporter = nodemailer.createTransport({
	service: env.BACKEND_NODEMAILER_SERVICE,
	host: env.BACKEND_NODEMAILER_HOST,
	port: env.BACKEND_NODEMAILER_PORT,
	secure: false,
	auth: {
		user: env.BACKEND_NODEMAILER_EMAIL,
		pass: env.BACKEND_NODEMAILER_PASS,
	},
});
