import { BlurFilter } from "pixi.js";
import type { EffectModule } from "./types";

export const blur: EffectModule = {
	label: "Blur",
	params: {
		strength: {
			label: "Blur Strength",
			min: 0,
			max: 20,
			step: 0.5,
			default: 4,
		},
	},
	create: () => new BlurFilter({ strength: 0 }),
	apply(f, p) {
		(f as BlurFilter).strength = p.strength ?? 0;
	},
};
