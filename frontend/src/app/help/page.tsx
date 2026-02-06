"use client";

import { useState, useMemo } from "react";
import { Nav } from "@/components/ui/Nav";
import { SearchIcon } from "@/components/icons";
import { FAQ_DATA, FaqSection, ContactSection } from "@/components/help";

export default function HelpPage() {
	const [search, setSearch] = useState("");

	const filteredData = useMemo(() => {
		if (!search.trim()) return FAQ_DATA;
		const query = search.toLowerCase();
		return FAQ_DATA.map((category) => ({
			...category,
			items: category.items.filter(
				(item) =>
					item.question.toLowerCase().includes(query) ||
					item.answer.toLowerCase().includes(query),
			),
		})).filter((category) => category.items.length > 0);
	}, [search]);

	const defaultOpenValues = search.trim()
		? filteredData.flatMap((cat) => cat.items.map((item) => item.question))
		: [];

	return (
		<div className="flex min-h-screen flex-col bg-white">
			<Nav
				centerLogo
				backLink={{ label: "Back", href: "/" }}
				actions={[
					{
						label: "Dashboard",
						href: "/dashboard",
						variant: "filled",
					},
				]}
			/>

			<main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-10 pb-16 md:pt-14">
				{/* Header */}
				<div className="text-center">
					<h1 className="font-display text-4xl font-bold text-brand-brown md:text-5xl">
						Help &amp; Support
					</h1>
					<p className="mt-3 text-base text-brand-brown/60">
						Find answers to common questions about My Genius Summary
					</p>
				</div>

				{/* Search */}
				<div className="relative mt-8">
					<label htmlFor="help-search" className="sr-only">
						Search for help
					</label>
					<div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
						<SearchIcon className="text-brand-brown/40" />
					</div>
					<input
						id="help-search"
						type="search"
						placeholder="Search for help..."
						aria-label="Search for help"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-14 w-full rounded-lg border border-brand-cream bg-white pl-11 pr-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
					/>
				</div>

				<FaqSection
					categories={filteredData}
					defaultOpenValues={defaultOpenValues}
					search={search}
				/>

				<ContactSection />
			</main>
		</div>
	);
}
