import { apiReference } from "@scalar/express-api-reference";
import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { env } from "../env";

export function configureOpenApi(app: Express) {
	const options = {
		definition: {
			openapi: "3.0.0",
			info: {
				title: "Mare Backend API",
				version: "1.0.0",
				description: "API documentation for Mare Backend",
			},
			servers: [
				{
					url: `http://BACKEND_URL:${env.BACKEND_PORT}`,
					description: "Development server",
				},
			],
		},
		apis: ["./src/routes/*.ts"],
	};

	const openapiSpecification = swaggerJsdoc(options);

	app.get("/docs-raw", (_req, res) => {
		res.setHeader("Content-Type", "application/json");
		res.send(openapiSpecification);
	});

	app.get(
		"/docs",
		apiReference({
			theme: "kepler",
			layout: "modern",
			defaultHttpClient: {
				targetKey: "js",
				clientKey: "fetch",
			},
			spec: {
				url: "/docs-raw",
			},
		}),
	);
}
