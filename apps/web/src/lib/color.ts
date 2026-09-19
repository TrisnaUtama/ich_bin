export type RGB = { r: number; g: number; b: number };
export type HSV = { h: number; s: number; v: number };

export function clamp(n: number, min: number, max: number) {
	return Math.min(max, Math.max(min, n));
}

export function isValidHex(hex: string): boolean {
	return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex.trim());
}

export function normalizeHex(hex: string): string {
	let h = hex.trim().replace(/^#/, "");
	if (h.length === 3) {
		h = h
			.split("")
			.map((c) => c + c)
			.join("");
	}
	return `#${h.toLowerCase()}`;
}

export function hexToRgb(hex: string): RGB {
	const normalized = normalizeHex(isValidHex(hex) ? hex : "#000000");
	const int = Number.parseInt(normalized.slice(1), 16);
	return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
}

export function rgbToHex({ r, g, b }: RGB): string {
	const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsv({ r, g, b }: RGB): HSV {
	const rn = r / 255;
	const gn = g / 255;
	const bn = b / 255;
	const max = Math.max(rn, gn, bn);
	const min = Math.min(rn, gn, bn);
	const d = max - min;

	let h = 0;
	if (d !== 0) {
		if (max === rn) h = ((gn - bn) / d) % 6;
		else if (max === gn) h = (bn - rn) / d + 2;
		else h = (rn - gn) / d + 4;
		h *= 60;
		if (h < 0) h += 360;
	}

	const s = max === 0 ? 0 : d / max;
	const v = max;
	return { h, s, v };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
	const c = v * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v - c;
	let rp = 0;
	let gp = 0;
	let bp = 0;

	if (h < 60) [rp, gp, bp] = [c, x, 0];
	else if (h < 120) [rp, gp, bp] = [x, c, 0];
	else if (h < 180) [rp, gp, bp] = [0, c, x];
	else if (h < 240) [rp, gp, bp] = [0, x, c];
	else if (h < 300) [rp, gp, bp] = [x, 0, c];
	else [rp, gp, bp] = [c, 0, x];

	return { r: (rp + m) * 255, g: (gp + m) * 255, b: (bp + m) * 255 };
}

export function hexToHsv(hex: string): HSV {
	return rgbToHsv(hexToRgb(hex));
}

export function hsvToHex(hsv: HSV): string {
	return rgbToHex(hsvToRgb(hsv));
}

export function readableTextColor(hex: string): "#0b0b0e" | "#ffffff" {
	const { r, g, b } = hexToRgb(hex);
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.6 ? "#0b0b0e" : "#ffffff";
}
