import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uDarkR;
uniform float uDarkG;
uniform float uDarkB;
uniform float uLightR;
uniform float uLightG;
uniform float uLightB;
uniform float uContrast;
uniform float uIntensity;

void main(void){
  vec2 uv = vTextureCoord;
  vec4 tex = texture(uTexture, uv);
  float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

  // Apply contrast curve
  luma = clamp((luma - 0.5) * (1.0 + uContrast) + 0.5, 0.0, 1.0);

  vec3 dark = vec3(uDarkR, uDarkG, uDarkB);
  vec3 light = vec3(uLightR, uLightG, uLightB);
  vec3 duotone = mix(dark, light, luma);

  vec3 result = mix(tex.rgb, duotone, uIntensity);
  gl_FragColor = vec4(result, tex.a);
}
`;

export const duotone: EffectModule = {
	label: "Duotone",
	params: {
		preset: {
			label: "Preset",
			min: 0,
			max: 5,
			step: 1,
			default: 0,
			kind: "select",
			options: [
				{ label: "Midnight Blue", value: 0 },
				{ label: "Sunset", value: 1 },
				{ label: "Neon Pink", value: 2 },
				{ label: "Forest", value: 3 },
				{ label: "Sepia", value: 4 },
				{ label: "Cyberpunk", value: 5 },
			],
		},
		contrast: {
			label: "Contrast",
			min: -50,
			max: 100,
			step: 1,
			default: 20,
		},
		intensity: {
			label: "Mix",
			min: 0,
			max: 100,
			step: 1,
			default: 100,
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "duotone",
			}),
			resources: {
				duotoneUniforms: {
					uDarkR: { value: 0.05, type: "f32" },
					uDarkG: { value: 0.05, type: "f32" },
					uDarkB: { value: 0.2, type: "f32" },
					uLightR: { value: 0.95, type: "f32" },
					uLightG: { value: 0.85, type: "f32" },
					uLightB: { value: 0.6, type: "f32" },
					uContrast: { value: 0.2, type: "f32" },
					uIntensity: { value: 1.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "duotoneUniforms");
		const presets: [number, number, number, number, number, number][] = [
			[0.05, 0.05, 0.2, 0.95, 0.85, 0.6],   // Midnight Blue
			[0.4, 0.1, 0.05, 1.0, 0.85, 0.3],       // Sunset
			[0.15, 0.0, 0.2, 1.0, 0.3, 0.7],         // Neon Pink
			[0.02, 0.1, 0.05, 0.6, 0.95, 0.4],       // Forest
			[0.2, 0.12, 0.05, 0.95, 0.85, 0.65],     // Sepia
			[0.0, 0.05, 0.15, 0.0, 0.95, 1.0],       // Cyberpunk
		];
		const idx = Math.min(Math.floor(p.preset ?? 0), presets.length - 1);
		const [dr, dg, db, lr, lg, lb] = presets[idx];
		u.uDarkR = dr;
		u.uDarkG = dg;
		u.uDarkB = db;
		u.uLightR = lr;
		u.uLightG = lg;
		u.uLightB = lb;
		u.uContrast = (p.contrast ?? 0) / 100;
		u.uIntensity = (p.intensity ?? 100) / 100;
	},
};
