import {
	GRADIENT_PRESETS,
	type GradientPreset,
	gradientPresetToCss,
} from "#/lib/gradient-presets";
import { cn } from "#/lib/utils/cn";

export function GradientPresetGrid({
	activeId,
	onSelect,
}: {
	activeId?: string;
	onSelect: (preset: GradientPreset) => void;
}) {
	return (
		<div className="grid grid-cols-4 gap-2">
			{GRADIENT_PRESETS.map((preset) => (
				<button
					key={preset.id}
					type="button"
					onClick={() => onSelect(preset)}
					title={preset.name}
					className={cn(
						"group relative h-10 overflow-hidden rounded-lg ring-1 ring-inset ring-white/10 transition-transform hover:scale-[1.04]",
						activeId === preset.id && "ring-2 ring-primary-400",
					)}
					style={{ backgroundImage: gradientPresetToCss(preset) }}
				>
					<span className="sr-only">{preset.name}</span>
				</button>
			))}
		</div>
	);
}
