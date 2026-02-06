export function setAuthCookies(
	accessToken: string,
	refreshToken: string,
): void {
	document.cookie = `accessToken=${accessToken}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
	document.cookie = `refreshToken=${refreshToken}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
}

export function clearAuthCookies(): void {
	document.cookie = "accessToken=; path=/; max-age=0";
	document.cookie = "refreshToken=; path=/; max-age=0";
}

export function getAccessToken(): string | undefined {
	if (typeof document === "undefined") return undefined;
	const match = document.cookie.match(/(?:^|; )accessToken=([^;]*)/);
	return match?.[1];
}
