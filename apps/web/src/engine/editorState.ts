import { EFFECT_REGISTRY } from "#/engine/effects";
import type { CanvasBackground, ImageControls, Template } from "#/engine/type";

export interface TextState {
	value: string;
	font: string;
	size: number;
	letterSpacing: number;
	color: string;
	weight: "normal" | "bold";
	align: "left" | "center" | "right";
}

export interface EffectState {
	type: keyof typeof EFFECT_REGISTRY;
	enabled: boolean;
	params: Record<string, number>;
}

export interface MaskState {
	text: string;
	font: string;
	size: number;
}

export interface TextFillState {
	text: string;
	font: string;
	size: number;
	lineHeight: number;
	color: string;
	mode: "inner" | "outer";
}

export interface EditorState {
	aspectRatio: string;
	background: CanvasBackground;
	image: ImageControls;
	mask: MaskState | null;
	textFill: TextFillState | null;
	texts: Record<string, TextState>;
	effects: Record<string, EffectState>;
	sections: {
		source: boolean;
		effects: boolean;
		typography: boolean;
		canvas: boolean;
	};
}

export function makeInitialState(template: Template): EditorState {
	const texts: Record<string, TextState> = {};
	const effects: Record<string, EffectState> = {};
	let mask: MaskState | null = null;
	let textFill: TextFillState | null = null;
	let image: ImageControls = {
		exposure: 0,
		contrast: 0,
		saturation: 0,
		temperature: 0,
		tint: 0,
		highlights: 0,
		shadows: 0,
		opacity: 100,
		scale: 100,
		rotation: 0,
	};

	for (const layer of template.layers) {
		if (layer.type === "text") {
			texts[layer.slot] = {
				value: layer.default,
				font: layer.font,
				size: layer.size,
				letterSpacing: layer.letterSpacing,
				color: layer.color,
				weight: layer.weight ?? "normal",
				align: layer.align ?? "left",
			};
		}
		if (layer.type === "image") {
			image = { ...image, ...layer.controls };
			if (layer.maskText) {
				mask = {
					text: layer.maskText.text,
					font: layer.maskText.font,
					size: layer.maskText.size,
				};
			}
			if (layer.textFill) {
				textFill = { ...layer.textFill };
			}
			for (const fx of layer.effects) {
				const def = EFFECT_REGISTRY[fx.type];
				const params: Record<string, number> = {};
				for (const key of Object.keys(def.params)) {
					const fromTemplate = (fx as unknown as Record<string, unknown>)[key];
					params[key] =
						typeof fromTemplate === "number"
							? fromTemplate
							: def.params[key as keyof typeof def.params].default;
				}
				effects[fx.id] = { type: fx.type, enabled: true, params };
			}
		}
	}

	return {
		aspectRatio: template.aspectRatios[0],
		background: (() => {
			const bg = structuredClone(template.canvas.background);
			if (!bg.texture)
				bg.texture = {
					name: "none",
					blendMode: "multiply",
					opacity: 70,
					fill: 100,
				};
			return bg;
		})(),
		image,
		mask,
		textFill,
		texts,
		effects,
		sections: { source: true, effects: true, typography: true, canvas: true },
	};
}
