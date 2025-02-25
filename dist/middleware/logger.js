"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = logger;
function logger() {
    return (req, res, next) => {
        req.timestamp = new Date().toISOString();
        const userAgent = req.get("User-Agent") || "Unknown User-Agent";
        console.log(`${req.timestamp} ${req.method} ${req.ip} ${req.originalUrl} - ${userAgent}`);
        next();
    };
}
