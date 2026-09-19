import type { Filter } from "pixi.js";

export interface ParamDescriptor {
	label: string;
	min: number;
	max: number;
	step: number;
	default: number;
	kind?: "slider" | "select";
	options?: { label: string; value: number }[];
}

export interface EffectModule {
	label: string;
	animated?: boolean;
	params: Record<string, ParamDescriptor>;
	create(): Filter;
	apply(filter: Filter, params: Record<string, number>, time: number): void;
}
