import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/utils/api";

export function useValidateAccessCode() {
	const router = useRouter();
	const [isValidating, setIsValidating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	async function validate(rawCode: string) {
		const code = rawCode.trim().toUpperCase();
		if (!code) return;

		setIsValidating(true);
		setError(null);

		try {
			const res = await fetch(`${API_BASE_URL}/shared/${code}`);

			if (!res.ok) {
				const data = await res.json();
				if (res.status === 410) {
					setError("This access code has expired.");
				} else if (res.status === 404) {
					setError("Invalid access code. Please check and try again.");
				} else {
					setError(data.error || "Something went wrong.");
				}
				setIsValidating(false);
				return;
			}

			router.push(`/shared/${code}`);
		} catch {
			setError("Unable to connect. Please try again.");
			setIsValidating(false);
		}
	}

	return { validate, isValidating, error, clearError: () => setError(null) };
}
