"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import * as Accordion from "@radix-ui/react-accordion";
import { Nav } from "@/components/ui/Nav";
import { cn } from "@/lib/utils";

/* ── FAQ Data ── */

type FaqItem = { question: string; answer: string };
type FaqCategory = { title: string; items: FaqItem[] };

const FAQ_DATA: FaqCategory[] = [
	{
		title: "Getting Started",
		items: [
			{
				question: "What is My Genius Profile?",
				answer:
					"My Genius Profile is a tool designed to help parents and educators discover and celebrate the unique strengths and talents of their children. Through guided conversations, we build a comprehensive profile that highlights your child's genius across multiple dimensions.",
			},
			{
				question: "How long does it take to complete a profile?",
				answer:
					"Most profiles take about 20–30 minutes to complete in one sitting, but you can save your progress and return at any time using your access code. There's no rush — take the time you need to thoughtfully reflect on your child's strengths.",
			},
			{
				question: "Do I need an account to start?",
				answer:
					"You can start a profile without an account by using an access code. However, creating an account allows you to save multiple profiles, share them with educators, and access additional features.",
			},
		],
	},
	{
		title: "Access Codes",
		items: [
			{
				question: "What is an access code?",
				answer:
					"An access code is a unique 8-character code (formatted as XXXX-XXXX) that lets you return to your in-progress or completed profile. It's provided when you start a new profile and can be found in your confirmation email.",
			},
			{
				question: "I lost my access code. What do I do?",
				answer:
					"If you created an account, you can log in to find all your profiles. Otherwise, check your email for the confirmation message we sent when you started the profile. If you still can't find it, contact our support team for assistance.",
			},
			{
				question: "How long is my access code valid?",
				answer:
					"Access codes do not expire. You can use your code to return to your profile at any time, whether it's been a day or a year since your last visit.",
			},
		],
	},
	{
		title: "Privacy & Data",
		items: [
			{
				question: "How is my data protected?",
				answer:
					"We take data privacy seriously. All conversations and profile data are encrypted in transit and at rest. We never share your personal information with third parties without your explicit consent. Our platform complies with COPPA and other relevant privacy regulations.",
			},
			{
				question: "Can I delete my profile?",
				answer:
					"Yes, you can delete your profile at any time. Log in to your account, go to your profile settings, and select 'Delete Profile.' This action is permanent and cannot be undone. If you need help, contact our support team.",
			},
		],
	},
];

/* ── Chevron Icon ── */

function ChevronDown({ className }: { className?: string }) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			aria-hidden="true"
		>
			<path d="M5 7.5L10 12.5L15 7.5" />
		</svg>
	);
}

/* ── Contact Icons ── */

function EmailSupportIcon() {
	return (
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="M22 4L12 13 2 4" />
		</svg>
	);
}

function LiveChatIcon() {
	return (
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
		</svg>
	);
}

function DocumentationIcon() {
	return (
		<svg
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
			<polyline points="14 2 14 8 20 8" />
			<line x1="16" y1="13" x2="8" y2="13" />
			<line x1="16" y1="17" x2="8" y2="17" />
			<polyline points="10 9 9 9 8 9" />
		</svg>
	);
}

/* ── Search Icon ── */

function SearchIcon() {
	return (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="text-brand-brown/40"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	);
}

/* ── Page ── */

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

	// When searching, auto-open all matching items
	const defaultOpenValues = search.trim()
		? filteredData.flatMap((cat) =>
				cat.items.map((item) => item.question),
			)
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

			<main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-10 pb-16 md:pt-14">
				{/* Header */}
				<div className="text-center">
					<h1 className="font-display text-4xl font-bold text-brand-brown md:text-5xl">
						Help &amp; Support
					</h1>
					<p className="mt-3 text-base text-brand-brown/60">
						Find answers to common questions about My Genius Profile
					</p>
				</div>

				{/* Search */}
				<div className="relative mt-8">
					<label htmlFor="help-search" className="sr-only">
						Search for help
					</label>
					<div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
						<SearchIcon />
					</div>
					<input
						id="help-search"
						type="search"
						placeholder="Search for help..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="h-14 w-full rounded-lg border border-brand-cream bg-white pl-11 pr-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
					/>
				</div>

				{/* FAQ Sections */}
				{filteredData.length === 0 ? (
					<div className="mt-12 text-center">
						<p className="text-brand-brown/60">
							No results found for &ldquo;{search}&rdquo;
						</p>
					</div>
				) : (
					filteredData.map((category) => (
						<section
							key={category.title}
							className="mt-10"
							aria-labelledby={`faq-heading-${category.title.replace(/\s+/g, "-").toLowerCase()}`}
						>
							<h2
								id={`faq-heading-${category.title.replace(/\s+/g, "-").toLowerCase()}`}
								className="font-display text-xl font-bold text-brand-brown md:text-2xl"
							>
								{category.title}
							</h2>

							<Accordion.Root
								type="multiple"
								defaultValue={defaultOpenValues}
								className="mt-4 space-y-2"
							>
								{category.items.map((item) => (
									<Accordion.Item
										key={item.question}
										value={item.question}
										className="rounded-lg border border-stone-200 transition-colors data-[state=open]:border-stone-300"
									>
										<Accordion.Header asChild>
											<h3>
												<Accordion.Trigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-brand-brown transition-colors hover:text-brand-brown/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 md:text-base">
													<span>
														{item.question}
													</span>
													<ChevronDown className="shrink-0 text-brand-brown/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
												</Accordion.Trigger>
											</h3>
										</Accordion.Header>
										<Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
											<div className="px-5 pb-4 text-sm leading-relaxed text-brand-brown/70">
												{item.answer}
											</div>
										</Accordion.Content>
									</Accordion.Item>
								))}
							</Accordion.Root>
						</section>
					))
				)}

				{/* Still Need Help */}
				<section
					className="mt-14 rounded-2xl bg-stone-50 p-6 md:p-8"
					aria-labelledby="still-need-help"
				>
					<div className="text-center">
						<h2
							id="still-need-help"
							className="font-display text-xl font-bold text-brand-brown md:text-2xl"
						>
							Still Need Help?
						</h2>
						<p className="mt-1 text-sm text-brand-brown/60">
							Our support team is here to assist you
						</p>
					</div>

					<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
						<Link
							href="mailto:support@villageofwisdom.org"
							className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							<EmailSupportIcon />
							<div className="text-center">
								<p className="text-sm font-bold">
									Email Support
								</p>
								<p className="mt-0.5 text-xs text-brand-brown/60 underline underline-offset-2">
									support@villageofwisdom.org
								</p>
							</div>
						</Link>

						<button
							type="button"
							className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							<LiveChatIcon />
							<div className="text-center">
								<p className="text-sm font-bold">Live Chat</p>
								<p className="mt-0.5 text-xs text-brand-brown/60">
									Start a conversation
								</p>
							</div>
						</button>

						<Link
							href="/docs"
							className="flex flex-col items-center gap-3 rounded-xl border border-stone-200 bg-white p-5 text-brand-brown transition-colors hover:border-stone-300 hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							<DocumentationIcon />
							<div className="text-center">
								<p className="text-sm font-bold">
									Documentation
								</p>
								<p className="mt-0.5 text-xs text-brand-brown/60">
									View full guides
								</p>
							</div>
						</Link>
					</div>
				</section>
			</main>
		</div>
	);
}
