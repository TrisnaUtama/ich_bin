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
		key: "destroyedAction",
		templateId: null,
		image: null,
		accent: "from-[#0c1220] via-[#1f3350] to-[#3fd6c9]",
	},
	{
		key: "chromaticBlur",
		templateId: null,
		image: null,
		accent: "from-[#0a0b2e] via-[#241f7a] to-[#5a6bff]",
	},
	{
		key: "filmGrainDrip",
		templateId: null,
		image: null,
		accent: "from-[#2a0a06] via-[#5c1a10] to-[#d9603a]",
	},
	{
		key: "riso",
		templateId: null,
		image: null,
		accent: "from-[#0e2410] via-[#20461f] to-[#8fd166]",
	},
	{
		key: "duotoneSunset",
		templateId: null,
		image: null,
		accent: "from-[#1a1004] via-[#7a3a08] to-[#ffb84d]",
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
