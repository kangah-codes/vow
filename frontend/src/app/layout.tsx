import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { OfflineDetector } from "@/components/ui/OfflineDetector";
import { Providers } from "@/lib/providers";
import "./globals.css";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "My Genius Profile",
	description: "Discover and celebrate your child's unique genius",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<link
					rel="icon"
					href="https://villageofwisdom.org/wp-content/uploads/2024/03/cropped-Favicon@4x-192x192.png"
					sizes="192x192"
				/>
				<link
					rel="icon"
					href="https://villageofwisdom.org/wp-content/uploads/2024/03/cropped-Favicon@4x-32x32.png"
					sizes="32x32"
				/>
				<link
					rel="apple-touch-icon"
					href="https://villageofwisdom.org/wp-content/uploads/2024/03/cropped-Favicon@4x-180x180.png"
				/>
			</head>
			<body className={`${inter.variable} antialiased`}>
				<Providers>
					{/* <OfflineDetector /> */}
					{children}
				</Providers>
			</body>
		</html>
	);
}
