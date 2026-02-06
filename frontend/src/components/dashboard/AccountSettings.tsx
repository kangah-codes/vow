interface AccountSettingsProps {
	name: string;
	email: string;
	role: string;
}

export function AccountSettings({ name, email, role }: AccountSettingsProps) {
	return (
		<section
			className="rounded-xl border border-stone-200 bg-white p-5 md:p-8"
			aria-labelledby="account-settings-heading"
		>
			<h2
				id="account-settings-heading"
				className="font-display text-xl font-bold text-brand-brown md:text-2xl"
			>
				Account Settings
			</h2>

			<dl className="mt-6 divide-y divide-stone-100">
				<div className="py-4 first:pt-0">
					<dt className="text-sm font-bold text-brand-brown">Name</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{name}</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Edit
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Email</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{email}</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Change email
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Password</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">••••••••</dd>
					<dd>
						<button
							type="button"
							className="mt-1 text-sm text-brand-brown underline underline-offset-2 transition-colors hover:text-brand-brown/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Change password
						</button>
					</dd>
				</div>

				<div className="py-4">
					<dt className="text-sm font-bold text-brand-brown">Account Type</dt>
					<dd className="mt-1 text-sm text-brand-brown/70">{role}</dd>
				</div>
			</dl>
		</section>
	);
}
