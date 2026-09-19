export type GradientStop = { position: number; color: string };

export type GradientPreset = {
	id: string;
	name: string;
	angle: number;
	stops: GradientStop[];
};

export const GRADIENT_PRESETS: GradientPreset[] = [
	{
		id: "ember-blaze",
		name: "Ember Blaze",
		angle: 120,
		stops: [
			{ position: 0, color: "#14060a" },
			{ position: 0.55, color: "#b32610" },
			{ position: 1, color: "#ee3d0b" },
		],
	},
	{
		id: "sunset-fade",
		name: "Sunset Fade",
		angle: 100,
		stops: [
			{ position: 0, color: "#3d0d0a" },
			{ position: 0.5, color: "#f4442e" },
			{ position: 1, color: "#ffb057" },
		],
	},
	{
		id: "violet-dusk",
		name: "Violet Dusk",
		angle: 135,
		stops: [
			{ position: 0, color: "#1a0630" },
			{ position: 1, color: "#c23bd6" },
		],
	},
	{
		id: "deep-space",
		name: "Deep Space",
		angle: 160,
		stops: [
			{ position: 0, color: "#0a0b2e" },
			{ position: 1, color: "#5a6bff" },
		],
	},
	{
		id: "aqua-mint",
		name: "Aqua Mint",
		angle: 130,
		stops: [
			{ position: 0, color: "#0c1220" },
			{ position: 1, color: "#3fd6c9" },
		],
	},
	{
		id: "forest-glow",
		name: "Forest Glow",
		angle: 140,
		stops: [
			{ position: 0, color: "#0e2410" },
			{ position: 1, color: "#8fd166" },
		],
	},
	{
		id: "charcoal",
		name: "Charcoal",
		angle: 180,
		stops: [
			{ position: 0, color: "#08080a" },
			{ position: 1, color: "#3a3a42" },
		],
	},
	{
		id: "golden-hour",
		name: "Golden Hour",
		angle: 110,
		stops: [
			{ position: 0, color: "#1a1004" },
			{ position: 0.5, color: "#7a3a08" },
			{ position: 1, color: "#ffb84d" },
		],
	},
];

export function gradientPresetToCss(preset: GradientPreset): string {
	const stops = preset.stops
		.map((s) => `${s.color} ${Math.round(s.position * 100)}%`)
		.join(", ");
	return `linear-gradient(${preset.angle}deg, ${stops})`;
}
