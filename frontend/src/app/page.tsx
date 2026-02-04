"use client";

import { useState } from "react";
import { Nav } from "@/components/ui/Nav";
import { ActionCard } from "@/components/ui/ActionCard";
import { HowItWorksStep } from "@/components/ui/HowItWorksStep";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useValidateAccessCode } from "@/lib/hooks/useValidateAccessCode";
import Image from "next/image";

export default function Home() {
	const [accessCode, setAccessCode] = useState("");
	const { data: user } = useCurrentUser();
	const { validate, isValidating, error } = useValidateAccessCode();

	return (
		<div className="min-h-screen bg-white">
			<Nav
				actions={[
					user
						? { label: "Dashboard", href: "/dashboard", variant: "filled" }
						: { label: "Login", href: "/login", variant: "filled" },
					{ label: "Help", href: "/help", variant: "outlined" },
				]}
			/>

			{/* ── Hero Section ── */}
			<section className="relative overflow-hidden bg-brand-purple px-6 pb-16 pt-12 md:px-16 md:pb-24 md:pt-16">
				{/* Decorative red swoosh */}
				<div
					className="pointer-events-none absolute inset-0"
					aria-hidden="true"
				>
					<svg
						className="absolute -right-32 -top-20 h-[600px] w-[900px] md:-right-16 md:-top-10 md:h-[800px] md:w-[1200px]"
						viewBox="0 0 1200 800"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M1200 0C1000 100 800 400 600 350C400 300 300 500 100 600C0 650 -100 800 -100 800"
							stroke="#DB4733"
							strokeWidth="120"
							strokeLinecap="round"
							fill="none"
							opacity="0.9"
						/>
					</svg>
					<svg
						className="absolute -bottom-40 -left-48 h-[500px] w-[800px] md:-bottom-32 md:-left-32 md:h-[700px] md:w-[1100px]"
						viewBox="0 0 1100 700"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M-100 100C100 200 300 0 500 100C700 200 900 50 1100 200"
							stroke="#DB4733"
							strokeWidth="120"
							strokeLinecap="round"
							fill="none"
							opacity="0.7"
						/>
					</svg>
				</div>

				{/* Hero content */}
				<div className="relative z-10 mx-auto max-w-7xl text-center">
					<h1 className="font-display text-4xl font-bold leading-tight text-white md:text-7xl md:leading-none">
						Welcome to My Genius Summary
					</h1>
					<p className="mx-auto mt-4 max-w-lg text-lg text-white/80 md:mt-6 md:text-xl">
						Discover and celebrate your child&apos;s unique genius
					</p>

					{/* Action cards */}
					<div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
						<ActionCard
							title="Start New Profile"
							description="Begin a guided conversation to create your child's profile"
							buttonLabel="Start"
							buttonHref="/start"
						/>
						<ActionCard
							title="Resume With Access Code"
							description="Continue where you left off"
							buttonLabel="Continue"
							input={{
								placeholder: "Enter 8-character code",
								value: accessCode,
								onChange: setAccessCode,
							}}
							loading={isValidating}
							error={error}
							onButtonClick={() => validate(accessCode)}
						/>
					</div>
				</div>
			</section>

			{/* ── How It Works Section ── */}
			<section className="mx-auto max-w-6xl px-6 py-16 md:px-16 md:py-24">
				<h2 className="font-display text-3xl font-bold text-brand-brown md:text-4xl">
					How It Works
				</h2>

				<div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-3 md:gap-8">
					<div className="relative">
						<HowItWorksStep
							step={1}
							description="Answer questions about your child"
							imageSrc="/images/step-1.png"
							imageAlt="Parent answering questions about their child"
							decorations={
								<Image
									src="images/twirl.svg"
									alt="Image twirl decoration"
									width={236}
									height={26}
									className="absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2"
								/>
							}
						/>
					</div>
					<div className="relative">
						<HowItWorksStep
							step={2}
							description="Watch their profile build in real-time"
							imageSrc="/images/step-2.png"
							imageAlt="Child's profile being built in real-time"
							decorations={
								<Image
									src="images/twirl.svg"
									alt="Image twirl decoration"
									width={236}
									height={26}
									className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 rotate-90 scale-75"
								/>
							}
						/>
					</div>
					<div className="relative">
						<HowItWorksStep
							step={3}
							description="Download and share with educators"
							imageSrc="/images/step-3.png"
							imageAlt="Sharing the profile with educators"
							decorations={
								<Image
									src="images/twirl.svg"
									alt="Image twirl decoration"
									width={236}
									height={26}
									className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2"
								/>
							}
						/>
					</div>
				</div>
			</section>
		</div>
	);
}
