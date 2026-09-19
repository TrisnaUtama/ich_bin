import { blur } from "./blur";
import { pixelStretch } from "./pixelStretch";
import type { EffectModule, ParamDescriptor } from "./types";

export const EFFECTS: Record<string, EffectModule> = {
	pixelStretch,
	blur,
};

export type EffectType = keyof typeof EFFECTS;

export const EFFECT_REGISTRY = Object.fromEntries(
	Object.entries(EFFECTS).map(([k, v]) => [
		k,
		{ label: v.label, params: v.params },
	]),
) as Record<string, { label: string; params: Record<string, ParamDescriptor> }>;

export type { EffectModule, ParamDescriptor };
