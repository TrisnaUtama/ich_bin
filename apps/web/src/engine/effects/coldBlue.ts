import { Filter, GlProgram } from "pixi.js";
import { FILTER_VERTEX, uni } from "./shared";
import type { EffectModule } from "./types";

const FRAGMENT = `
in vec2 vTextureCoord;
uniform sampler2D uTexture;
uniform highp vec4 uInputSize;
uniform float uTint;
uniform float uContrast;
uniform float uBrightness;
uniform float uGlow;
uniform float uGlowRadius;
uniform float uThreshold;

vec3 grade(vec3 c){
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  l = clamp((l - 0.5) * uContrast + 0.5 + uBrightness, 0.0, 1.0);

  vec3 shadow = vec3(0.020, 0.030, 0.075);
  vec3 mid    = vec3(0.230, 0.360, 0.620);
  vec3 high   = vec3(0.820, 0.910, 1.000);

  vec3 duo = mix(
    mix(shadow, mid, smoothstep(0.0, 0.55, l)),
    high,
    smoothstep(0.45, 1.0, l)
  );
  return mix(c, duo, uTint);
}

void main(void){
  vec2 uv = vTextureCoord;
  vec4 src = texture(uTexture, uv);
  vec3 base = grade(src.rgb);

  // Halation: sampling spiral (golden angle)
  vec3 glow = vec3(0.0);
  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float r  = sqrt((fi + 0.5) / 16.0);
    float th = fi * 2.39996323;
    vec2 o = vec2(cos(th), sin(th)) * r * uGlowRadius * uInputSize.zw;
    vec3 s = grade(texture(uTexture, uv + o).rgb);
    float lum = dot(s, vec3(0.3333));
    glow += s * smoothstep(uThreshold, 1.0, lum);
  }
  glow /= 16.0;
  glow *= uGlow;

  // Screen blend
  vec3 col = 1.0 - (1.0 - base) * (1.0 - glow);

  gl_FragColor = vec4(col, src.a);
}
`;

export const coldBlue: EffectModule = {
  label: "Cold Blue",
  params: {
    tint: { label: "Blue Tint", min: 0, max: 100, step: 1, default: 85 },
    contrast: { label: "Contrast", min: 50, max: 200, step: 1, default: 130 },
    brightness: { label: "Brightness", min: -50, max: 50, step: 1, default: 0 },
    glow: { label: "Glow", min: 0, max: 150, step: 1, default: 60 },
    glowRadius: {
      label: "Glow Radius",
      min: 0,
      max: 150,
      step: 1,
      default: 40,
    },
    threshold: {
      label: "Glow Threshold",
      min: 0,
      max: 90,
      step: 1,
      default: 35,
    },
  },
  create() {
    return new Filter({
      glProgram: GlProgram.from({
        vertex: FILTER_VERTEX,
        fragment: FRAGMENT,
        name: "cold-blue",
      }),
      resources: {
        coldBlueUniforms: {
          uTint: { value: 0.85, type: "f32" },
          uContrast: { value: 1.3, type: "f32" },
          uBrightness: { value: 0.0, type: "f32" },
          uGlow: { value: 0.6, type: "f32" },
          uGlowRadius: { value: 40.0, type: "f32" },
          uThreshold: { value: 0.35, type: "f32" },
        },
      },
    });
  },
  apply(f, p) {
    const u = uni(f, "coldBlueUniforms");
    u.uTint = (p.tint ?? 85) / 100;
    u.uContrast = (p.contrast ?? 130) / 100;
    u.uBrightness = (p.brightness ?? 0) / 100;
    u.uGlow = (p.glow ?? 60) / 100;
    u.uGlowRadius = p.glowRadius ?? 40;
    u.uThreshold = (p.threshold ?? 35) / 100;
  },
};
