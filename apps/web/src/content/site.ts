export const brand = {
	name: "ZINEFORGE",
	tagline: "Create studio-grade visuals in seconds.",
} as const;

export const navLinks = [
	{ key: "home", href: "/" },
	{ key: "templates", href: "#templates" },
	{ key: "showcase", href: "/showcase" },
	{ key: "about", href: "/about" },
] as const;

export const hero = {
	image: "/landing/hero.png",
	actions: {
		primary: { href: "#templates" },
		secondary: { href: "/showcase" },
	},
} as const;

export const templatesShowcase = [
	{
		key: "stretchWaveTimur",
		templateId: "stretch-wave-timur",
		image: null,
		accent: "from-[#3a1002] via-[#7a2a06] to-[#ff9a3e]",
	},
	{
		key: "shapeTextMask",
		templateId: "shape-text-mask",
		image: null,
		accent: "from-[#050506] via-[#1a1a1e] to-[#3a3a42]",
	},
	{
		key: "textFill",
		templateId: "text-fill",
		image: null,
		accent: "from-[#1a0630] via-[#5b1a86] to-[#c23bd6]",
	},
	{
		key: "glitchPoster",
		templateId: "glitch-poster",
		image: null,
		accent: "from-[#0a0a0f] via-[#1a0a2e] to-[#00ffaa]",
	},
	{
		key: "duotonePortrait",
		templateId: "duotone-portrait",
		image: null,
		accent: "from-[#0d0d1a] via-[#1a0a30] to-[#e8d5b7]",
	},
	{
		key: "halftoneMagazine",
		templateId: "halftone-magazine",
		image: null,
		accent: "from-[#f5f0e8] via-[#b0a890] to-[#1a1a1a]",
	},
	{
		key: "vintageFilm",
		templateId: "vintage-film",
		image: null,
		accent: "from-[#1a1510] via-[#5a4a30] to-[#d4c4a0]",
	},
	{
		key: "neonGlow",
		templateId: "neon-glow",
		image: null,
		accent: "from-[#050510] via-[#ff00ff] to-[#00ffff]",
	},
	{
		key: "pixelMosaic",
		templateId: "pixel-mosaic",
		image: null,
		accent: "from-[#0f0f1a] via-[#00ff88] to-[#88aaff]",
	},
	{
		key: "waveDreams",
		templateId: "wave-dreams",
		image: null,
		accent: "from-[#0a0520] via-[#200a3a] to-[#c8a0ff]",
	},
	{
		key: "boldSplit",
		templateId: "bold-split",
		image: null,
		accent: "from-[#ffffff] via-[#888888] to-[#000000]",
	},
] as const;

export const auth = {
	image: "/auth/right-panel.png",
	heading: `Welcome to ${brand.name}`,
	subheading: brand.tagline,
	terms: [
		{ label: "Terms of Service", href: "/terms" },
		{ label: "Privacy Policy", href: "/privacy" },
	],
	testimonial: {
		quote: `Working with ${brand.name} has absolutely elevated my attention to detail, creativity, and deep understanding of how experimental design can bring my product briefs to life.`,
		author: "Arya Stark",
		role: "Creative Director",
	},
} as const;
