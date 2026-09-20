import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uLevels;
uniform float uGamma;
uniform float uIntensity;

void main(void){
  vec2 uv = vTextureCoord;
  vec4 tex = texture(uTexture, uv);

  // Apply gamma before quantization for better tonal distribution
  vec3 gammaCorrected = pow(tex.rgb, vec3(uGamma));

  float levels = max(uLevels, 2.0);
  vec3 posterized = floor(gammaCorrected * levels + 0.5) / levels;

  // Undo gamma
  posterized = pow(posterized, vec3(1.0 / uGamma));

  vec3 result = mix(tex.rgb, posterized, uIntensity);
  gl_FragColor = vec4(result, tex.a);
}
`;

export const posterize: EffectModule = {
	label: "Posterize",
	params: {
		levels: {
			label: "Color Levels",
			min: 2,
			max: 16,
			step: 1,
			default: 5,
		},
		gamma: {
			label: "Gamma",
			min: 50,
			max: 200,
			step: 5,
			default: 100,
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
				name: "posterize",
			}),
			resources: {
				posterizeUniforms: {
					uLevels: { value: 5.0, type: "f32" },
					uGamma: { value: 1.0, type: "f32" },
					uIntensity: { value: 1.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "posterizeUniforms");
		u.uLevels = p.levels ?? 5;
		u.uGamma = (p.gamma ?? 100) / 100;
		u.uIntensity = (p.intensity ?? 100) / 100;
	},
};
