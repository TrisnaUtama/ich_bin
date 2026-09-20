import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uRadius;
uniform float uSoftness;
uniform float uDarkness;

void main(void){
  vec2 uv = vTextureCoord;
  vec4 tex = texture(uTexture, uv);

  vec2 center = uv - 0.5;
  float dist = length(center) * 2.0;
  float vig = smoothstep(uRadius, uRadius - uSoftness, dist);
  vec3 col = tex.rgb * mix(1.0 - uDarkness, 1.0, vig);

  gl_FragColor = vec4(col, tex.a);
}
`;

export const vignette: EffectModule = {
	label: "Vignette",
	params: {
		radius: {
			label: "Radius",
			min: 10,
			max: 100,
			step: 1,
			default: 70,
		},
		softness: {
			label: "Softness",
			min: 5,
			max: 100,
			step: 1,
			default: 50,
		},
		darkness: {
			label: "Darkness",
			min: 0,
			max: 100,
			step: 1,
			default: 60,
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "vignette",
			}),
			resources: {
				vignetteUniforms: {
					uRadius: { value: 0.7, type: "f32" },
					uSoftness: { value: 0.5, type: "f32" },
					uDarkness: { value: 0.6, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "vignetteUniforms");
		u.uRadius = (p.radius ?? 70) / 100;
		u.uSoftness = (p.softness ?? 50) / 100;
		u.uDarkness = (p.darkness ?? 60) / 100;
	},
};
