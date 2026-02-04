import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/conversation", "/profile", "/start"];
const authRoutes = ["/login", "/signup"];

function isProtectedRoute(pathname: string): boolean {
	return protectedRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

function isAuthRoute(pathname: string): boolean {
	return authRoutes.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

async function verifyToken(
	token: string,
): Promise<"valid" | "expired" | "invalid"> {
	const secret = process.env.JWT_SECRET;
	if (!secret) return "invalid";

	try {
		await jwtVerify(token, new TextEncoder().encode(secret));
		return "valid";
	} catch (err) {
		if (
			err instanceof Error &&
			"code" in err &&
			(err as { code: string }).code === "ERR_JWT_EXPIRED"
		) {
			return "expired";
		}
		return "invalid";
	}
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("accessToken")?.value;
	const status = token ? await verifyToken(token) : "invalid";
	const isValid = status === "valid";

	if (isProtectedRoute(pathname) && !isValid) {
		if (status === "expired") {
			const response = NextResponse.redirect(
				new URL("/session-expired", request.url),
			);
			response.cookies.delete("accessToken");
			response.cookies.delete("refreshToken");
			return response;
		}

		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirect", pathname);
		return NextResponse.redirect(loginUrl);
	}

	if (isAuthRoute(pathname) && isValid) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/conversation/:path*",
		"/profile/:path*",
		"/login",
		"/signup",
		"/start",
	],
};
