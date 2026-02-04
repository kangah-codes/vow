"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Nav } from "@/components/ui/Nav";
import { useCreateProfile } from "@/lib/hooks/useCreateProfile";

interface StartFormValues {
	studentName: string;
	gradeLevel: string;
	age: string;
	school: string;
	relationship: string;
}

export default function StartPage() {
	const router = useRouter();
	const createProfile = useCreateProfile();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<StartFormValues>({
		defaultValues: {
			studentName: "",
			gradeLevel: "",
			age: "",
			school: "",
			relationship: "",
		},
	});

	const onSubmit = (data: StartFormValues) => {
		createProfile.mutate(
			{
				studentName: data.studentName,
				gradeLevel: data.gradeLevel,
				age: data.age ? Number(data.age) : undefined,
				school: data.school || undefined,
				relationship: data.relationship,
			},
			{
				onSuccess: (res) => {
					router.push(`/conversation/${res.data.conversationId}`);
				},
			},
		);
	};

	return (
		<div className="flex min-h-screen flex-col bg-brand-brown">
			<Nav
				dark
				actions={[
					{ label: "New Profile", href: "/start", variant: "orange" },
					{ label: "Help", href: "/help", variant: "outlined" },
				]}
			/>

			<main className="relative flex flex-1 items-start justify-center overflow-hidden px-6 py-10 md:items-center md:py-16">
				{/* Decorative red swooshes on dark bg */}
				<div
					className="pointer-events-none absolute inset-0"
					aria-hidden="true"
				>
					<svg
						className="absolute -left-32 -top-20 h-200 w-300"
						viewBox="0 0 1200 800"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M-100 200C100 400 300 0 500 200C700 400 900 100 1100 300"
							stroke="#DB4733"
							strokeWidth="80"
							strokeLinecap="round"
							fill="none"
							opacity="0.8"
						/>
					</svg>
					<svg
						className="absolute -bottom-32 -right-48 h-200 w-300"
						viewBox="0 0 1200 800"
						fill="none"
						preserveAspectRatio="none"
					>
						<path
							d="M400 0C500 200 700 400 800 200C900 0 1100 300 1300 100C1300 100 1200 500 1000 600C800 700 600 400 400 600"
							stroke="#DB4733"
							strokeWidth="80"
							strokeLinecap="round"
							fill="none"
							opacity="0.7"
						/>
					</svg>
				</div>

				{/* Start card */}
				<div className="relative z-10 w-full max-w-lg rounded-2xl bg-white px-8 py-12 md:px-14 md:py-16">
					<h1 className="text-center font-display text-3xl font-bold text-brand-brown md:text-4xl">
						Let&apos;s Get Started
					</h1>
					<p className="mt-3 text-center text-base text-brand-brown/70">
						Tell us a bit about the student you&apos;re creating a profile for
					</p>

					{/* Info tip */}
					<div className="mt-6 rounded-lg border-l-4 border-brand-orange bg-amber-50 px-5 py-4">
						<p className="text-sm font-bold text-brand-brown">
							<span aria-hidden="true" className="mr-1">
								🔑
							</span>
							You&apos;ll receive an access code
						</p>
						<p className="mt-1 text-sm text-brand-brown/70">
							Save this code to continue your conversation anytime. You
							don&apos;t need to complete it in one session.
						</p>
					</div>

					{createProfile.error && (
						<div className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
							{createProfile.error.message}
						</div>
					)}

					<form
						className="mt-8 space-y-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Student's Name */}
						<div>
							<label className="text-sm font-bold text-brand-brown">
								Student&apos;s Name{" "}
								<span className="text-brand-orange">*</span>
							</label>
							<input
								type="text"
								placeholder="First and Last Name"
								{...register("studentName", {
									required: "Student's name is required",
								})}
								className="mt-1.5 h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
							{errors.studentName && (
								<p className="mt-1 text-sm text-red-500">
									{errors.studentName.message}
								</p>
							)}
						</div>

						{/* Grade Level + Age */}
						<div className="grid gap-5 md:grid-cols-2">
							<div>
								<label className="text-sm font-bold text-brand-brown">
									Grade Level{" "}
									<span className="text-brand-orange">*</span>
								</label>
								<select
									{...register("gradeLevel", {
										required: "Grade level is required",
									})}
									className="mt-1.5 h-14 w-full appearance-none rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition focus:border-brand-brown/40"
								>
									<option value="" disabled>
										Select grade
									</option>
									<option value="pre-k">Pre-K</option>
									<option value="k">Kindergarten</option>
									<option value="1">1st Grade</option>
									<option value="2">2nd Grade</option>
									<option value="3">3rd Grade</option>
									<option value="4">4th Grade</option>
									<option value="5">5th Grade</option>
									<option value="6">6th Grade</option>
									<option value="7">7th Grade</option>
									<option value="8">8th Grade</option>
									<option value="9">9th Grade</option>
									<option value="10">10th Grade</option>
									<option value="11">11th Grade</option>
									<option value="12">12th Grade</option>
								</select>
								{errors.gradeLevel && (
									<p className="mt-1 text-sm text-red-500">
										{errors.gradeLevel.message}
									</p>
								)}
							</div>
							<div>
								<label className="text-sm font-bold text-brand-brown">
									Age (Optional)
								</label>
								<select
									{...register("age")}
									className="mt-1.5 h-14 w-full appearance-none rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition focus:border-brand-brown/40"
								>
									<option value="">
										Select age
									</option>
									{Array.from({ length: 15 }, (_, i) => i + 4).map((a) => (
										<option key={a} value={a}>
											{a}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* School */}
						<div>
							<label className="text-sm font-bold text-brand-brown">
								School (Optional)
							</label>
							<input
								type="text"
								placeholder="School name"
								{...register("school")}
								className="mt-1.5 h-14 w-full rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition placeholder:text-brand-brown/40 focus:border-brand-brown/40"
							/>
						</div>

						{/* Relationship */}
						<div>
							<label className="text-sm font-bold text-brand-brown">
								Your Relationship{" "}
								<span className="text-brand-orange">*</span>
							</label>
							<select
								{...register("relationship", {
									required: "Relationship is required",
								})}
								className="mt-1.5 h-14 w-full appearance-none rounded-lg border border-brand-cream bg-white px-4 text-base text-brand-brown outline-none transition focus:border-brand-brown/40"
							>
								<option value="" disabled>
									Select relationship
								</option>
								<option value="parent">Parent</option>
								<option value="guardian">Guardian</option>
								<option value="grandparent">Grandparent</option>
								<option value="caregiver">Caregiver</option>
								<option value="educator">Educator</option>
								<option value="other">Other</option>
							</select>
							{errors.relationship && (
								<p className="mt-1 text-sm text-red-500">
									{errors.relationship.message}
								</p>
							)}
						</div>

						{/* Submit */}
						<button
							type="submit"
							disabled={createProfile.isPending}
							className="!mt-8 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-brand-brown text-base font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 disabled:opacity-60"
						>
							{createProfile.isPending ? (
								"Creating Profile..."
							) : (
								<>
									Begin Conversation
									<svg
										width="16"
										height="16"
										viewBox="0 0 16 16"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M3 8h10M9 4l4 4-4 4" />
									</svg>
								</>
							)}
						</button>
					</form>

					<div className="mt-6 text-center">
						<Link
							href="/"
							className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-brand-orange transition-colors hover:text-brand-orange/80"
						>
							<span aria-hidden="true">&larr;</span>
							Back to Home
						</Link>
					</div>
				</div>
			</main>
		</div>
	);
}
