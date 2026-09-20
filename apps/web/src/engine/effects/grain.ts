import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, GLSL_HASH, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uAmount;
uniform float uSize;
uniform float uSpeed;
uniform float uColorNoise;
${GLSL_HASH}

void main(void){
  vec2 uv = vTextureCoord;
  vec4 tex = texture(uTexture, uv);

  vec2 grainUv = uv * (1.0 / max(uSize * 0.005, 0.001));
  float seed = uSpeed * 0.01 + 1.0;

  float mono = (hash(grainUv * seed) - 0.5) * uAmount;

  vec3 col;
  if (uColorNoise > 0.5) {
    // Color noise — different noise per channel
    float nr = (hash(grainUv * seed * 1.1) - 0.5) * uAmount;
    float ng = (hash(grainUv * seed * 1.3) - 0.5) * uAmount;
    float nb = (hash(grainUv * seed * 1.7) - 0.5) * uAmount;
    col = tex.rgb + vec3(nr, ng, nb);
  } else {
    col = tex.rgb + mono;
  }

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), tex.a);
}
`;

export const grain: EffectModule = {
	label: "Film Grain",
	params: {
		amount: {
			label: "Amount",
			min: 0,
			max: 100,
			step: 1,
			default: 30,
		},
		size: {
			label: "Grain Size",
			min: 10,
			max: 100,
			step: 1,
			default: 50,
		},
		speed: {
			label: "Variation",
			min: 0,
			max: 100,
			step: 1,
			default: 50,
		},
		colorNoise: {
			label: "Color Noise",
			min: 0,
			max: 1,
			step: 1,
			default: 0,
			kind: "select",
			options: [
				{ label: "Mono", value: 0 },
				{ label: "Color", value: 1 },
			],
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "grain",
			}),
			resources: {
				grainUniforms: {
					uAmount: { value: 0.3, type: "f32" },
					uSize: { value: 0.5, type: "f32" },
					uSpeed: { value: 0.5, type: "f32" },
					uColorNoise: { value: 0.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "grainUniforms");
		u.uAmount = (p.amount ?? 0) / 100;
		u.uSize = (p.size ?? 50) / 100;
		u.uSpeed = (p.speed ?? 50) / 100;
		u.uColorNoise = p.colorNoise ?? 0;
	},
};
