import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uAmplitudeX;
uniform float uAmplitudeY;
uniform float uFrequencyX;
uniform float uFrequencyY;
uniform float uSpeed;
uniform float uPhase;

void main(void){
  vec2 uv = vTextureCoord;

  float px = uPhase * 0.01;
  float waveX = sin(uv.y * uFrequencyX * 6.2831 + px) * uAmplitudeX * 0.05;
  float waveY = cos(uv.x * uFrequencyY * 6.2831 + px * 1.3) * uAmplitudeY * 0.05;

  vec2 warped = clamp(uv + vec2(waveX, waveY), 0.0, 1.0);
  gl_FragColor = texture(uTexture, warped);
}
`;

export const waveDistortion: EffectModule = {
	label: "Wave Distortion",
	params: {
		amplitudeX: {
			label: "Amplitude X",
			min: 0,
			max: 100,
			step: 1,
			default: 40,
		},
		amplitudeY: {
			label: "Amplitude Y",
			min: 0,
			max: 100,
			step: 1,
			default: 20,
		},
		frequencyX: {
			label: "Frequency X",
			min: 1,
			max: 20,
			step: 0.5,
			default: 4,
		},
		frequencyY: {
			label: "Frequency Y",
			min: 1,
			max: 20,
			step: 0.5,
			default: 3,
		},
		phase: {
			label: "Phase / Offset",
			min: 0,
			max: 100,
			step: 1,
			default: 0,
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "wave-distortion",
			}),
			resources: {
				waveUniforms: {
					uAmplitudeX: { value: 0.4, type: "f32" },
					uAmplitudeY: { value: 0.2, type: "f32" },
					uFrequencyX: { value: 4.0, type: "f32" },
					uFrequencyY: { value: 3.0, type: "f32" },
					uSpeed: { value: 0.0, type: "f32" },
					uPhase: { value: 0.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "waveUniforms");
		u.uAmplitudeX = (p.amplitudeX ?? 0) / 100;
		u.uAmplitudeY = (p.amplitudeY ?? 0) / 100;
		u.uFrequencyX = p.frequencyX ?? 4;
		u.uFrequencyY = p.frequencyY ?? 3;
		u.uPhase = p.phase ?? 0;
	},
};
