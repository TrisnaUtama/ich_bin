import type { Filter } from "pixi.js";

export const FILTER_VERTEX = `
in vec2 aPosition;
out vec2 vTextureCoord;
uniform vec4 uInputSize;
uniform vec4 uOutputFrame;
uniform vec4 uOutputTexture;
vec4 filterVertexPosition(void){
  vec2 position = aPosition * uOutputFrame.zw + uOutputFrame.xy;
  position.x = position.x * (2.0 / uOutputTexture.x) - 1.0;
  position.y = position.y * (2.0 * uOutputTexture.z / uOutputTexture.y) - uOutputTexture.z;
  return vec4(position, 0.0, 1.0);
}
vec2 filterTextureCoord(void){
  return aPosition * (uOutputFrame.zw * uInputSize.zw);
}
void main(void){
  gl_Position = filterVertexPosition();
  vTextureCoord = filterTextureCoord();
}
`;

export const GLSL_HASH = `
float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
`;

export function uni(filter: Filter, group: string): Record<string, number> {
	return (filter.resources[group] as { uniforms: Record<string, number> })
		.uniforms;
}
