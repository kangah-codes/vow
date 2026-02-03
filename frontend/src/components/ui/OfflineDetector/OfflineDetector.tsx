"use client";

import { useEffect, useState } from "react";
import { ConnectionLost } from "@/components/ui/ConnectionLost";

export function OfflineDetector() {
	const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

	useEffect(() => {
		const handleOffline = () => setIsOffline(true);
		const handleOnline = () => setIsOffline(false);

		window.addEventListener("offline", handleOffline);
		window.addEventListener("online", handleOnline);

		return () => {
			window.removeEventListener("offline", handleOffline);
			window.removeEventListener("online", handleOnline);
		};
	}, []);

	if (!isOffline) return null;

	return <ConnectionLost />;
}

export default OfflineDetector;
