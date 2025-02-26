import type { Request, Response } from "express";

export function getUsers(req: Request, res: Response): void {
  res.send({ message: "GET sample routes" });
}
