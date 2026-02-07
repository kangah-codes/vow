"use client";

import Link from "next/link";
import { useState } from "react";
import * as Toast from "@radix-ui/react-toast";
import { Nav } from "@/components/ui/Nav";
import { useCurrentUser } from "@/lib/hooks/useCurrentUser";
import { useProfiles, type Profile } from "@/lib/hooks/useProfiles";
import { useLogout } from "@/lib/hooks/useLogout";
import { useDeleteProfile } from "@/lib/hooks/useDeleteProfile";
import { useFocusGroupPrompt } from "@/lib/hooks/useFocusGroupPrompt";
import { downloadProfilePdf } from "@/lib/utils/downloadProfilePdf";
import {
	ProfilesCarousel,
	EmptyProfiles,
	AccountSettings,
	FocusGroupDialog,
	DashboardToast,
	ProfilesSkeleton,
	AccountSettingsSkeleton,
} from "@/components/dashboard";

export default function DashboardPage() {
	const { data: user, isLoading: userLoading } = useCurrentUser();
	const { data: profiles, isLoading: profilesLoading } = useProfiles();
	const { mutate: logout } = useLogout();
	const deleteProfile = useDeleteProfile();
	const focusGroupPrompt = useFocusGroupPrompt();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [toast, setToast] = useState<{
		open: boolean;
		type: "share" | "downloading";
	}>({ open: false, type: "share" });

	const showToast = (type: "share" | "downloading") => {
		setToast({ open: false, type });
		setTimeout(() => setToast({ open: true, type }), 0);
	};

	const showFocusGroupDialog =
		!userLoading && user && user.focusGroupPrompted === false;

	const handleDelete = (profileId: string) => {
		setDeletingId(profileId);
		deleteProfile.mutate(profileId, {
			onSettled: () => setDeletingId(null),
		});
	};

	const handleShare = (accessCode: string) => {
		const url = `${window.location.origin}/shared/${accessCode}`;
		navigator.clipboard.writeText(url).then(() => showToast("share"));
	};

	const handleDownload = async (
		studentName: string,
		sections: Profile["sections"],
	) => {
		showToast("downloading");
		try {
			await downloadProfilePdf(studentName, sections);
		} finally {
			setToast({ open: false, type: "downloading" });
		}
	};

	const isLoading = userLoading || profilesLoading;

	return (
		<Toast.Provider swipeDirection="right">
			<div className="flex min-h-screen flex-col bg-white">
				<Nav
					greeting={user ? `Welcome, ${user.firstName}` : undefined}
					actions={[
						{ label: "Help", href: "/help", variant: "filled" },
						{ label: "Logout", onClick: () => logout(), variant: "outlined" },
					]}
				/>

				<main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-16 md:px-6 md:pt-12">
					{/* Header */}
					<h1 className="font-display text-4xl font-bold text-brand-brown md:text-5xl">
						My Dashboard
					</h1>
					<p className="mt-2 text-sm text-brand-brown/60">
						Manage your student profiles and account settings
					</p>

					{/* Action buttons */}
					<div className="mt-6 flex flex-col gap-3 sm:flex-row">
						<Link
							href="/start"
							aria-label="Start new profile"
							className="inline-flex h-12 items-center justify-center rounded-full bg-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-brown/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Start New Profile
						</Link>
						<Link
							href="/resume"
							aria-label="Resume with access code"
							className="inline-flex h-12 items-center justify-center rounded-full border-2 border-brand-brown px-6 text-sm font-bold uppercase tracking-wider text-brand-brown transition-colors hover:bg-brand-brown/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
						>
							Resume with Code
						</Link>
					</div>

					{/* Your Profiles */}
					<section className="mt-12" aria-labelledby="profiles-heading">
						<h2
							id="profiles-heading"
							className="font-display text-2xl font-bold text-brand-brown md:text-3xl"
						>
							Your Profiles
						</h2>

						{isLoading ? (
							<ProfilesSkeleton />
						) : profiles && profiles.length > 0 ? (
							<ProfilesCarousel
								profiles={profiles}
								onDelete={handleDelete}
								onShare={handleShare}
								onDownload={handleDownload}
								deletingId={deletingId}
							/>
						) : (
							<EmptyProfiles />
						)}
					</section>

					{/* Account Settings */}
					<div className="mt-12">
						{isLoading ? (
							<AccountSettingsSkeleton />
						) : (
							<AccountSettings
								name={user ? `${user.firstName} ${user.lastName}` : ""}
								email={user ? user.email : ""}
								role={user ? user.role : ""}
							/>
						)}
					</div>
				</main>

				<FocusGroupDialog
					open={!!showFocusGroupDialog}
					isPending={focusGroupPrompt.isPending}
					onRespond={(optIn) => focusGroupPrompt.mutate(optIn)}
				/>

				<DashboardToast
					open={toast.open}
					type={toast.type}
					onOpenChange={(open) => setToast((t) => ({ ...t, open }))}
				/>
			</div>
		</Toast.Provider>
	);
}
