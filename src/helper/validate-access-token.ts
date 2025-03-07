import jwt from "jsonwebtoken";
import env from "../env";

export const decryptToken = async (accessToken: string) => {
	try {
		return await jwt.verify(accessToken, env.BACKEND_AUTH_PRIVATE_KEY);
	} catch (_) {
		return null;
	}
};
