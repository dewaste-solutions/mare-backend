import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.DB_EXPRESS_PORT,
};
