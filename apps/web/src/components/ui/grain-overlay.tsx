import { cn } from "#/lib/utils/cn";

type GrainOverlayProps = {
	className?: string;
	opacity?: number;
};

export function GrainOverlay({ className, opacity = 0.16 }: GrainOverlayProps) {
	return (
		<div
			aria-hidden
			style={{ opacity }}
			className={cn(
				"pointer-events-none absolute inset-0 grain mix-blend-overlay",
				className,
			)}
		/>
	);
}
