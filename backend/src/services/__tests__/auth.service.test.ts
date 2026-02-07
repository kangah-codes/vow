import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import {
	hashPassword,
	comparePassword,
	generateAccessToken,
	generateRefreshToken,
} from "../auth.service";

jest.mock("bcryptjs", () => ({
	hash: jest.fn(),
	compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
}));

jest.mock("../../config/env", () => ({
	env: {
		JWT_SECRET: "secret",
		JWT_REFRESH_SECRET: "refresh-secret",
	},
}));

describe("auth.service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("hashPassword delegates to bcrypt", async () => {
		(bcrypt.hash as jest.Mock).mockResolvedValue("hashed");

		const result = await hashPassword("password");

		expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
		expect(result).toBe("hashed");
	});

	it("comparePassword delegates to bcrypt", async () => {
		(bcrypt.compare as jest.Mock).mockResolvedValue(true);

		const result = await comparePassword("password", "hash");

		expect(bcrypt.compare).toHaveBeenCalledWith("password", "hash");
		expect(result).toBe(true);
	});

	it("generateAccessToken signs with access secret", () => {
		(jwt.sign as jest.Mock).mockReturnValue("token");

		const token = generateAccessToken("user-id");

		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId: "user-id" },
			env.JWT_SECRET,
			{ expiresIn: "24h" },
		);
		expect(token).toBe("token");
	});

	it("generateRefreshToken signs with refresh secret", () => {
		(jwt.sign as jest.Mock).mockReturnValue("token");

		const token = generateRefreshToken("user-id");

		expect(jwt.sign).toHaveBeenCalledWith(
			{ userId: "user-id" },
			env.JWT_REFRESH_SECRET,
			{ expiresIn: "7d" },
		);
		expect(token).toBe("token");
	});
});
