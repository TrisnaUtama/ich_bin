export interface ParamDescriptor {
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}

// Katalog Image Controls (panel exposure/contrast/dll).
export const IMAGE_CONTROL_REGISTRY: Record<string, ParamDescriptor> = {
  exposure: { label: "Exposure", min: -100, max: 100, step: 1, default: 0 },
  contrast: { label: "Contrast", min: -100, max: 100, step: 1, default: 0 },
  saturation: { label: "Saturation", min: -100, max: 100, step: 1, default: 0 },
  temperature: {
    label: "Temperature",
    min: -100,
    max: 100,
    step: 1,
    default: 0,
  },
  tint: { label: "Tint", min: -100, max: 100, step: 1, default: 0 },
  highlights: { label: "Highlights", min: -100, max: 100, step: 1, default: 0 },
  shadows: { label: "Shadows", min: -100, max: 100, step: 1, default: 0 },
  opacity: { label: "Opacity", min: 0, max: 100, step: 1, default: 100 },
  scale: { label: "Scale", min: 10, max: 200, step: 1, default: 100 },
  rotation: { label: "Rotation", min: -180, max: 180, step: 1, default: 0 },
};

export interface TextureEntry {
  name: string;
  label: string;
  blendMode?: string;
  opacity?: number;
}

export const TEXTURE_CATALOG: readonly TextureEntry[] = [
  { name: "none", label: "None" },
  {
    name: "glow-grain",
    label: "Glow Grain",
    blendMode: "soft-light",
    opacity: 25,
  },
  {
    name: "paper-stack",
    label: "Paper Stack",
    blendMode: "screen",
    opacity: 35,
  },
  {
    name: "dark-waters-pulse",
    label: "Dark Waters Pulse",
    blendMode: "screen",
    opacity: 35,
  },
  {
    name: "perforated-mesh",
    label: "Perforated Mesh",
    blendMode: "screen",
    opacity: 30,
  },
  {
    name: "midnight-crease",
    label: "Midnight Crease",
    blendMode: "screen",
    opacity: 35,
  },
  {
    name: "noise-gradient-mesh",
    label: "Noise Gradient Mesh",
    blendMode: "screen",
    opacity: 30,
  },
];

// Nama harus persis sama dengan nama blend mode Pixi v8
// (kecil semua, pakai tanda hubung). Mode selain normal/add/multiply/screen
// butuh import "pixi.js/advanced-blend-modes" (sudah ada di TemplateEngine.ts).
export const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "soft-light",
  "hard-light",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "linear-burn",
  "linear-dodge",
  "linear-light",
  "vivid-light",
  "hard-mix",
  "difference",
  "exclusion",
] as const;
