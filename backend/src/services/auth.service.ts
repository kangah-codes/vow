import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

export function generateAccessToken(userId: string): string {
	return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "24h" });
}

export function generateRefreshToken(userId: string): string {
	return jwt.sign({ userId }, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}
