import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform float uScale;
uniform float uAngle;
uniform float uSmooth;
uniform float uShape;

void main(void){
  vec2 uv = vTextureCoord;
  vec4 tex = texture(uTexture, uv);
  float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

  float a = uAngle * 0.01745329;
  float ca = cos(a);
  float sa = sin(a);
  vec2 rotUv = vec2(
    uv.x * ca - uv.y * sa,
    uv.x * sa + uv.y * ca
  );

  float cellSize = uScale * 0.01;
  vec2 cell = rotUv / max(cellSize, 0.001);
  vec2 center = (floor(cell) + 0.5) * cellSize;

  // Rotate back to sample color
  vec2 sampleUv = vec2(
    center.x * ca + center.y * sa,
    -center.x * sa + center.y * ca
  );
  vec4 cellColor = texture(uTexture, clamp(sampleUv, 0.0, 1.0));
  float cellLuma = dot(cellColor.rgb, vec3(0.299, 0.587, 0.114));

  vec2 local = fract(cell) - 0.5;
  float dist;
  if (uShape < 0.5) {
    // Circle dots
    dist = length(local);
  } else {
    // Diamond dots
    dist = abs(local.x) + abs(local.y);
  }

  float radius = (1.0 - cellLuma) * 0.5;
  float dot = smoothstep(radius + uSmooth * 0.1, radius - uSmooth * 0.1, dist);

  vec3 col = cellColor.rgb * dot;
  gl_FragColor = vec4(col, tex.a);
}
`;

export const halftone: EffectModule = {
	label: "Halftone",
	params: {
		scale: {
			label: "Dot Size",
			min: 5,
			max: 100,
			step: 1,
			default: 30,
		},
		angle: {
			label: "Angle",
			min: 0,
			max: 180,
			step: 1,
			default: 45,
		},
		smooth: {
			label: "Smoothness",
			min: 0,
			max: 100,
			step: 1,
			default: 30,
		},
		shape: {
			label: "Shape",
			min: 0,
			max: 1,
			step: 1,
			default: 0,
			kind: "select",
			options: [
				{ label: "Circle", value: 0 },
				{ label: "Diamond", value: 1 },
			],
		},
	},
	create() {
		return new Filter({
			glProgram: GlProgram.from({
				vertex: FILTER_VERTEX,
				fragment: FRAGMENT,
				name: "halftone",
			}),
			resources: {
				halftoneUniforms: {
					uScale: { value: 0.3, type: "f32" },
					uAngle: { value: 45.0, type: "f32" },
					uSmooth: { value: 0.3, type: "f32" },
					uShape: { value: 0.0, type: "f32" },
				},
			},
		});
	},
	apply(f, p) {
		const u = uni(f, "halftoneUniforms");
		u.uScale = (p.scale ?? 30) / 100;
		u.uAngle = p.angle ?? 45;
		u.uSmooth = (p.smooth ?? 30) / 100;
		u.uShape = p.shape ?? 0;
	},
};
