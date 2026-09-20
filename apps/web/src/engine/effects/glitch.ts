import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, GLSL_HASH, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uIntensity;
uniform float uBlockSize;
uniform float uRgbShift;
uniform float uScanlines;
uniform float uSeed;
${GLSL_HASH}

void main(void){
  vec2 uv = vTextureCoord;
  float intensity = uIntensity;

  // Block displacement — horizontal glitch bands
  float blockY = floor(uv.y * uBlockSize) / uBlockSize;
  float noise = hash(vec2(blockY, uSeed));
  float threshold = 1.0 - intensity;

  float displaceX = 0.0;
  if (noise > threshold) {
    displaceX = (hash(vec2(blockY * 3.7, uSeed + 1.0)) - 0.5) * intensity * 0.15;
  }

  vec2 displaced = vec2(uv.x + displaceX, uv.y);

  // RGB channel split
  float shift = uRgbShift * 0.01;
  float r = texture(uTexture, vec2(displaced.x + shift, displaced.y)).r;
  float g = texture(uTexture, displaced).g;
  float b = texture(uTexture, vec2(displaced.x - shift, displaced.y)).b;
  float a = texture(uTexture, displaced).a;

  vec3 col = vec3(r, g, b);

  // Scanlines
  if (uScanlines > 0.0) {
    float scanline = sin(uv.y * 800.0) * 0.5 + 0.5;
    col *= mix(1.0, scanline, uScanlines * 0.3);
  }

  // Random color blocks
  if (noise > threshold + 0.15) {
    float blockHash = hash(vec2(blockY * 7.1, uSeed + 5.0));
    if (blockHash > 0.7) {
      col.r = mix(col.r, 1.0, 0.3 * intensity);
    } else if (blockHash > 0.4) {
      col.b = mix(col.b, 1.0, 0.3 * intensity);
    }
  }

  gl_FragColor = vec4(col, a);
}
`;

export const glitch: EffectModule = {
	label: "Glitch",
	params: {
		intensity: {
			label: "Intensity",
			min: 0,
			max: 100,
			step: 1,
			default: 50,
		},
		blockSize: {
			label: "Block Size",
			min: 5,
			max: 100,
			step: 1,
			default: 30,
		},
		rgbShift: {
			label: "RGB Shift",
			min: 0,
			max: 100,
			step: 1,
			default: 30,
		},
		scanlines: {
			label: "Scanlines",
			min: 0,
			max: 100,
			step: 1,
			default: 20,
		},
		seed: {
			label: "Variation",
			min: 0,
			max: 100,
			step: 1,
			default: 42,
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "glitch",
			}),
			resources: {
				glitchUniforms: {
					uIntensity: { value: 0.5, type: "f32" },
					uBlockSize: { value: 30.0, type: "f32" },
					uRgbShift: { value: 0.3, type: "f32" },
					uScanlines: { value: 0.2, type: "f32" },
					uSeed: { value: 42.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "glitchUniforms");
		u.uIntensity = (p.intensity ?? 0) / 100;
		u.uBlockSize = p.blockSize ?? 30;
		u.uRgbShift = (p.rgbShift ?? 0) / 100;
		u.uScanlines = (p.scanlines ?? 0) / 100;
		u.uSeed = p.seed ?? 42;
	},
};
