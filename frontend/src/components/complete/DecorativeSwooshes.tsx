export function DecorativeSwooshes() {
	return (
		<div
			className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
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
					opacity="0.5"
				/>
			</svg>
			<svg
				className="absolute -bottom-32 -right-48 h-200 w-300"
				viewBox="0 0 1200 800"
				fill="none"
				preserveAspectRatio="none"
			>
				<path
					d="M400 0C500 200 700 400 800 200C900 0 1100 300 1300 100C1300 100 1200 500 1000 600"
					stroke="#DB4733"
					strokeWidth="80"
					strokeLinecap="round"
					fill="none"
					opacity="0.4"
				/>
			</svg>
		</div>
	);
}
