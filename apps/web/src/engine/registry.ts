export interface ParamDescriptor {
	label: string;
	min: number;
	max: number;
	step: number;
	default: number;
}

// Katalog Image Controls (panel exposure/contrast/dll).
export const IMAGE_CONTROL_REGISTRY: Record<string, ParamDescriptor> = {
	exposure: { label: "Exposure", min: -100, max: 100, step: 1, default: 0 },
	contrast: { label: "Contrast", min: -100, max: 100, step: 1, default: 0 },
	saturation: { label: "Saturation", min: -100, max: 100, step: 1, default: 0 },
	temperature: {
		label: "Temperature",
		min: -100,
		max: 100,
		step: 1,
		default: 0,
	},
	tint: { label: "Tint", min: -100, max: 100, step: 1, default: 0 },
	highlights: { label: "Highlights", min: -100, max: 100, step: 1, default: 0 },
	shadows: { label: "Shadows", min: -100, max: 100, step: 1, default: 0 },
	opacity: { label: "Opacity", min: 0, max: 100, step: 1, default: 100 },
	scale: { label: "Scale", min: 10, max: 200, step: 1, default: 100 },
	rotation: { label: "Rotation", min: -180, max: 180, step: 1, default: 0 },
};

export const TEXTURE_CATALOG = [
	{ name: "none", label: "None" },
	{ name: "folded-paper", label: "Folded Paper" },
	{ name: "dither-pattern", label: "Dither Pattern" },
	{ name: "hexagon-halftone", label: "Hexagon Halftone" },
	{ name: "plastic-overlay", label: "Plastic Overlay" },
	{ name: "paper-stack", label: "Paper Stack" },
] as const;

export const BLEND_MODES = ["normal", "multiply", "screen", "overlay"] as const;
export const TEXTURES = [
	"folded-paper",
	"dither-pattern",
	"hexagon-halftone",
	"plastic-overlay",
] as const;
