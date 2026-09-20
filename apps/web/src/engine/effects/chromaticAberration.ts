import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uOffset;
uniform float uAngle;
uniform float uFalloff;

void main(void){
  vec2 uv = vTextureCoord;
  float a = uAngle * 0.01745329;
  vec2 dir = vec2(cos(a), sin(a)) * uOffset * 0.01;

  // Falloff from center — stronger at edges
  float dist = length(uv - 0.5) * 2.0;
  float f = mix(1.0, dist, uFalloff);
  vec2 offset = dir * f;

  float r = texture(uTexture, uv + offset).r;
  float g = texture(uTexture, uv).g;
  float b = texture(uTexture, uv - offset).b;
  float a2 = texture(uTexture, uv).a;

  gl_FragColor = vec4(r, g, b, a2);
}
`;

export const chromaticAberration: EffectModule = {
	label: "Chromatic Aberration",
	params: {
		offset: {
			label: "Offset",
			min: 0,
			max: 100,
			step: 1,
			default: 25,
		},
		angle: {
			label: "Angle",
			min: 0,
			max: 360,
			step: 1,
			default: 0,
		},
		falloff: {
			label: "Edge Falloff",
			min: 0,
			max: 100,
			step: 1,
			default: 50,
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "chromatic-aberration",
			}),
			resources: {
				chromaticUniforms: {
					uOffset: { value: 0.25, type: "f32" },
					uAngle: { value: 0.0, type: "f32" },
					uFalloff: { value: 0.5, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "chromaticUniforms");
		u.uOffset = (p.offset ?? 0) / 100;
		u.uAngle = p.angle ?? 0;
		u.uFalloff = (p.falloff ?? 0) / 100;
	},
};
