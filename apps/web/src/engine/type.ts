export type BlendMode = "normal" | "multiply" | "screen" | "overlay";

export interface GradientStop {
	color: string;
	position: number;
}

export interface CanvasBackground {
	kind: "solid" | "gradient";
	color: string;
	opacity: number;
	gradient: { type: "linear" | "radial"; angle: number; stops: GradientStop[] };
	texture?: {
		name: string;
		blendMode: BlendMode;
		opacity: number;
		fill: number;
	};
}

export interface ImageControls {
	exposure: number;
	contrast: number;
	saturation: number;
	temperature: number;
	tint: number;
	highlights: number;
	shadows: number;
	opacity: number;
	scale: number;
	rotation: number;
}

export type EffectType =
	| "pixelStretch"
	| "blur"
	| "chromaticAberration"
	| "glitch"
	| "halftone"
	| "duotone"
	| "vignette"
	| "grain"
	| "pixelate"
	| "waveDistortion"
	| "posterize";

export interface EffectDef {
	id: string;
	type: EffectType;
	stretchXLeft?: number;
	stretchXRight?: number;
	stretchAngle?: number;
	curveBend?: number;
	waveFrequency?: number;
	waveAmplitude?: number;
	intensity?: number;
	grain?: number;
	strength?: number;
	[key: string]: string | number | undefined;
}

export interface MaskText {
	text: string;
	font: string;
	size: number;
	letterSpacing?: number;
	x: number;
	y: number;
}

export interface TextFill {
	text: string;
	font: string;
	size: number;
	lineHeight: number;
	color: string;
	mode: "inner" | "outer";
}

export interface ImageLayer {
	type: "image";
	slot: string;
	fit?: "cover" | "contain";
	maskText?: MaskText;
	textFill?: TextFill;
	controls: ImageControls;
	effects: EffectDef[];
}

export interface TextLayer {
	type: "text";
	slot: string;
	label: string;
	default: string;
	font: string;
	size: number;
	letterSpacing: number;
	lineHeight?: number;
	weight?: "normal" | "bold";
	align?: "left" | "center" | "right";
	color: string;
	x: number;
	y: number;
	maxWidth?: number;
}

export type Layer = ImageLayer | TextLayer;

export interface Template {
	id: string;
	name: string;
	version: number;
	aspectRatios: string[];
	fonts: string[];
	canvas: { width: number; height: number; background: CanvasBackground };
	layers: Layer[];
}
