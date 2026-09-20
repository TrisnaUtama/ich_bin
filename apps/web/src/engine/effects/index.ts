import { blur } from "./blur";
import { chromaticAberration } from "./chromaticAberration";
import { duotone } from "./duotone";
import { glitch } from "./glitch";
import { grain } from "./grain";
import { halftone } from "./halftone";
import { pixelStretch } from "./pixelStretch";
import { pixelate } from "./pixelate";
import { posterize } from "./posterize";
import { vignette } from "./vignette";
import { waveDistortion } from "./waveDistortion";
import type { EffectModule, ParamDescriptor } from "./types";

export const EFFECTS: Record<string, EffectModule> = {
	pixelStretch,
	blur,
	chromaticAberration,
	glitch,
	halftone,
	duotone,
	vignette,
	grain,
	pixelate,
	waveDistortion,
	posterize,
};

export type EffectType = keyof typeof EFFECTS;

export const EFFECT_REGISTRY = Object.fromEntries(
	Object.entries(EFFECTS).map(([k, v]) => [
		k,
		{ label: v.label, params: v.params },
	]),
) as Record<string, { label: string; params: Record<string, ParamDescriptor> }>;

export type { EffectModule, ParamDescriptor };
