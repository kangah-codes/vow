import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/dashboard", "/conversation", "/complete"];
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

async function verifyToken(token: string): Promise<boolean> {
	const secret = process.env.JWT_SECRET;
	if (!secret) return false;

	try {
		await jwtVerify(token, new TextEncoder().encode(secret));
		return true;
	} catch {
		return false;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const token = request.cookies.get("accessToken")?.value;
	const isValid = token ? await verifyToken(token) : false;

	if (isProtectedRoute(pathname) && !isValid) {
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
		"/complete/:path*",
		"/login",
		"/signup",
	],
};
