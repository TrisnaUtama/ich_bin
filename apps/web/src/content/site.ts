export const brand = {
	name: "ZINEFORGE",
	tagline: "Create studio-grade visuals in seconds.",
} as const;

export const navLinks = [
	{ key: "home", href: "/" },
	{ key: "templates", href: "/templates" },
	{ key: "showcase", href: "/showcase" },
] as const;

export const hero = {
	image: "/landing/hero.png",
	actions: {
		primary: { href: "/templates" },
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

export interface ShowcaseImageItem {
	kind: "image";
	key: string;
	src: string;
	grayscale?: boolean;
}

export interface ShowcasePosterItem {
	kind: "poster";
	key: string;
	tag: string;
	title: string;
	subtitle: string;
	accent: string;
}

export type ShowcaseItem = ShowcaseImageItem | ShowcasePosterItem;

export const showcaseGallery: ShowcaseItem[][] = [
	[
		{ kind: "image", key: "a1", src: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=520&h=640&fit=crop&q=80" },
		{ kind: "image", key: "a2", src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=520&h=420&fit=crop&q=80", grayscale: true },
		{
			kind: "poster",
			key: "a3",
			tag: "Typography",
			title: "SYSTEM FAILURE",
			subtitle: "DISRUPT THE NORM",
			accent: "from-[#1a0603] via-[#5c1a10] to-[#ff6a3a]",
		},
		{ kind: "image", key: "a4", src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=520&h=480&fit=crop&q=80" },
	],
	[
		{ kind: "image", key: "b1", src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=520&h=460&fit=crop&q=80" },
		{ kind: "image", key: "b2", src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=520&h=560&fit=crop&q=80" },
		{ kind: "image", key: "b3", src: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=520&h=400&fit=crop&q=80", grayscale: true },
		{ kind: "image", key: "b4", src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=520&h=520&fit=crop&q=80" },
	],
	[
		{ kind: "image", key: "c1", src: "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=520&h=420&fit=crop&q=80" },
		{ kind: "image", key: "c2", src: "https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=520&h=560&fit=crop&q=80" },
		{ kind: "image", key: "c3", src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=520&h=380&fit=crop&q=80" },
		{ kind: "image", key: "c4", src: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=520&h=500&fit=crop&q=80" },
	],
	[
		{ kind: "image", key: "d1", src: "https://images.unsplash.com/photo-1522444195799-478538b28823?w=520&h=560&fit=crop&q=80" },
		{
			kind: "poster",
			key: "d2",
			tag: "Glitch",
			title: "FRACTURE",
			subtitle: "STATIC \u00b7 NO FUTURE",
			accent: "from-[#0a0a12] via-[#241f3a] to-[#ff2fd0]",
		},
		{ kind: "image", key: "d3", src: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=520&h=400&fit=crop&q=80" },
		{ kind: "image", key: "d4", src: "https://images.unsplash.com/photo-1476234251651-f353703a034d?w=520&h=460&fit=crop&q=80" },
	],
	[
		{ kind: "image", key: "e1", src: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=520&h=600&fit=crop&q=80" },
		{ kind: "image", key: "e2", src: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=520&h=380&fit=crop&q=80" },
		{ kind: "image", key: "e3", src: "https://images.unsplash.com/photo-1551893478-d60cc920032e?w=520&h=520&fit=crop&q=80" },
		{ kind: "image", key: "e4", src: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=520&h=440&fit=crop&q=80" },
	],
];

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
