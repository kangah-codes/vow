export type FaqItem = { question: string; answer: string };
export type FaqCategory = { title: string; items: FaqItem[] };

export const FAQ_DATA: FaqCategory[] = [
	{
		title: "Getting Started",
		items: [
			{
				question: "What is My Genius Summary?",
				answer:
					"My Genius Summary is a tool designed to help parents and educators discover and celebrate the unique strengths and talents of their children. Through guided conversations, we build a comprehensive profile that highlights your child's genius across multiple dimensions.",
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
