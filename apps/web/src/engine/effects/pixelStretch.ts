import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, GLSL_HASH, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uLeft;
uniform float uRight;
uniform float uCurve;
uniform float uAmp;
uniform float uIntensity;
uniform float uGrain;
uniform float uAngle;
uniform float uBend;
${GLSL_HASH}
void main(void){
  vec2 uv = vTextureCoord;
  float len = mix(0.04, 0.6, uIntensity);
  float a = uAngle * 0.01745329;
  vec2 dir = vec2(cos(a), sin(a));
  vec2 perp = vec2(-dir.y, dir.x);
  vec4 tex;
  if (uv.x < uLeft){
    float d = clamp((uLeft - uv.x) / max(len, 0.0001), 0.0, 1.0);
    float bend = sin(d * uCurve * 6.2831) * uAmp * d;
    vec2 warp = dir * d * uBend * 0.5 + perp * (uBend * d * d);
    tex = texture(uTexture, clamp(vec2(uLeft, clamp(uv.y + bend, 0.0, 1.0)) + warp, 0.0, 1.0));
  } else if (uv.x > uRight){
    float d = clamp((uv.x - uRight) / max(len, 0.0001), 0.0, 1.0);
    float bend = sin(d * uCurve * 6.2831) * uAmp * d;
    vec2 warp = dir * d * uBend * 0.5 + perp * (uBend * d * d);
    tex = texture(uTexture, clamp(vec2(uRight, clamp(uv.y + bend, 0.0, 1.0)) + warp, 0.0, 1.0));
  } else {
    tex = texture(uTexture, uv);
  }
  float g = (hash(uv * 800.0) - 0.5) * uGrain;
  gl_FragColor = vec4(tex.rgb + g, tex.a);
}
`;

export const pixelStretch: EffectModule = {
	label: "Pixel Stretch",
	animated: false,
	params: {
		stretchXLeft: {
			label: "Stretch X Left",
			min: 0,
			max: 50,
			step: 1,
			default: 45,
		},
		stretchXRight: {
			label: "Stretch X Right",
			min: 0,
			max: 50,
			step: 1,
			default: 45,
		},
		stretchAngle: {
			label: "Angle / Direction",
			min: 0,
			max: 360,
			step: 1,
			default: 0,
		},
		curveBend: {
			label: "Curvature / Bend",
			min: -100,
			max: 100,
			step: 1,
			default: 0,
		},
		waveFrequency: {
			label: "Wave Frequency",
			min: 0,
			max: 8,
			step: 0.1,
			default: 2.2,
		},
		waveAmplitude: {
			label: "Wave Amplitude",
			min: 0,
			max: 100,
			step: 1,
			default: 15,
		},
		intensity: {
			label: "Stretch Intensity",
			min: 0,
			max: 100,
			step: 1,
			default: 82,
		},
		grain: { label: "Grain Noise", min: 0, max: 15, step: 1, default: 4 },
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "pixel-stretch",
			}),
			resources: {
				stretchUniforms: {
					uLeft: { value: 0.45, type: "f32" },
					uRight: { value: 0.55, type: "f32" },
					uCurve: { value: 2.2, type: "f32" },
					uAmp: { value: 0.15, type: "f32" },
					uIntensity: { value: 0.82, type: "f32" },
					uGrain: { value: 0.08, type: "f32" },
					uAngle: { value: 0.0, type: "f32" },
					uBend: { value: 0.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "stretchUniforms");
		u.uLeft = (p.stretchXLeft ?? 0) / 100;
		u.uRight = 1.0 - (p.stretchXRight ?? 0) / 100;
		u.uCurve = p.waveFrequency ?? 0;
		u.uAmp = (p.waveAmplitude ?? 0) / 100;
		u.uIntensity = (p.intensity ?? 0) / 100;
		u.uGrain = (p.grain ?? 0) / 50;
		u.uAngle = p.stretchAngle ?? 0;
		u.uBend = (p.curveBend ?? 0) / 100;
	},
};
