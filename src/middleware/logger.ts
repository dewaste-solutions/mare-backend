import type { NextFunction, Request, Response } from "express";

interface CustomRequest extends Request {
  timestamp?: string;
}

export function logger() {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    req.timestamp = new Date().toISOString();
    const userAgent = req.get("User-Agent") || "Unknown User-Agent";

    console.log(
      `${req.timestamp} ${req.method} ${req.ip} ${req.originalUrl} - ${userAgent}`,
    );

    next();
  };
}
