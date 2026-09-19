import { brand } from "#/content/site";
import { cn } from "#/lib/utils/cn";

type BrandMarkProps = {
	className?: string;
	withDot?: boolean;
};

export function BrandMark({ className, withDot = false }: BrandMarkProps) {
	return (
		<span
			className={cn(
				"inline-flex items-center gap-2 font-extrabold tracking-[0.18em] text-white",
				className,
			)}
		>
			{withDot ? (
				<span className="size-2 rounded-full bg-flare-500 shadow-[0_0_14px_var(--color-flare-500)]" />
			) : null}
			{brand.name}
		</span>
	);
}
