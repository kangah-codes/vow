import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@/components/icons";
import type { FaqCategory } from "./faqData";

interface FaqSectionProps {
	categories: FaqCategory[];
	defaultOpenValues: string[];
	search: string;
}

export function FaqSection({
	categories,
	defaultOpenValues,
	search,
}: FaqSectionProps) {
	if (categories.length === 0) {
		return (
			<div className="mt-12 text-center">
				<p className="text-brand-brown/60">
					No results found for &ldquo;{search}&rdquo;
				</p>
			</div>
		);
	}

	return (
		<>
			{categories.map((category) => (
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
											<span>{item.question}</span>
											<ChevronDownIcon className="shrink-0 text-brand-brown/50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
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
			))}
		</>
	);
}
