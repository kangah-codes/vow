import { Request, Response } from "express";
import mongoose from "mongoose";

export function getHealth(_req: Request, res: Response): void {
	res.json({
		success: true,
		data: {
			status: "ok",
			timestamp: new Date().toISOString(),
			mongodb:
				mongoose.connection.readyState === 1 ? "connected" : "disconnected",
		},
	});
}
