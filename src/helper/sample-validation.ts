import type { NextFunction, Request, Response } from "express";

import { z } from "zod";

const sampleSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
  })
  .strict();

export function validateSample(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = sampleSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json(result.error);
    return;
  }

  next();
}

const sampleIdSchema = z
  .object({
    id: z.coerce
      .number()
      .int()
      .positive("Sample ID must be a positive integer"),
  })
  .strict();

export function validateSampleId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = sampleIdSchema.safeParse(req.params);

  if (!result.success) {
    res
      .status(400)
      .json({ error: "Invalid sample ID. Must be a positive integer." });
    return;
  }

  if (Object.keys(req.body).length > 0) {
    res.status(400).json({ error: "request should not have a body" });
    return;
  }

  next();
}
