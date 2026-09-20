import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uSize;
uniform float uRound;

void main(void){
  vec2 uv = vTextureCoord;
  float cellSize = max(uSize * 0.005, 0.001);

  vec2 cell = floor(uv / cellSize) * cellSize + cellSize * 0.5;
  vec4 col = texture(uTexture, cell);

  if (uRound > 0.5) {
    // Round pixels — circle shape within each cell
    vec2 local = (uv - cell) / cellSize;
    float dist = length(local);
    if (dist > 0.45) {
      col.rgb *= 0.15;
    }
  }

  gl_FragColor = col;
}
`;

export const pixelate: EffectModule = {
	label: "Pixelate",
	params: {
		size: {
			label: "Pixel Size",
			min: 5,
			max: 100,
			step: 1,
			default: 30,
		},
		round: {
			label: "Shape",
			min: 0,
			max: 1,
			step: 1,
			default: 0,
			kind: "select",
			options: [
				{ label: "Square", value: 0 },
				{ label: "Round", value: 1 },
			],
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "pixelate",
			}),
			resources: {
				pixelateUniforms: {
					uSize: { value: 0.3, type: "f32" },
					uRound: { value: 0.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "pixelateUniforms");
		u.uSize = (p.size ?? 30) / 100;
		u.uRound = p.round ?? 0;
	},
};
