import { cn } from "@/lib/utils";

interface SectionShellProps {
	/** Section stays mounted but hidden when false (per home-layout settings). */
	visible: boolean;
	/** Adds the standard section frame: bottom border + vertical padding. */
	bordered?: boolean;
	/** Renders only below the md breakpoint (mobile-only sections). */
	mobileOnly?: boolean;
	/** Extra classes for one-off layout needs (e.g. grid column spans). */
	className?: string;
	children: React.ReactNode;
}

/**
 * Shared wrapper for home/side-column sections. Centralizes the
 * visibility-toggle + border/padding pattern that was previously copy-pasted
 * across ~10 section components (`border-b border-gray-400 py-6` +
 * `isVisible ? "" : "hidden"`).
 */
export function SectionShell({
	visible,
	bordered = false,
	mobileOnly = false,
	className,
	children,
}: SectionShellProps) {
	return (
		<section
			className={cn(
				bordered && "border-b border-border py-6",
				mobileOnly && "md:hidden",
				!visible && "hidden",
				className
			)}
		>
			{children}
		</section>
	);
}
