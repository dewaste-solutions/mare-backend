import type { Request, Response } from "express";

export function notFoundLogger() {
	return (req: Request, res: Response) => {
		res.status(404).json({
			message: `Not Found - ${req.path}`,
		});
	};
}
