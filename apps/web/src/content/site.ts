export const brand = {
	name: "ZINEFORGE",
	tagline: "Create studio-grade visuals in seconds.",
} as const;

export const navLinks = [
	{ label: "Home", href: "/" },
	{ label: "Templates", href: "/templates" },
	{ label: "Showcase", href: "/showcase" },
	{ label: "About Us", href: "/about" },
] as const;

export const hero = {
	image: "/landing/hero.png",
	title: ["Instantly Create Studio", "Grade Posters & Merch."],
	description:
		"Design, distort, and transform ordinary photos into high-end posters, experimental typography, and custom apparel in seconds.",
	actions: {
		primary: { label: "Explore Templates", href: "/templates" },
		secondary: { label: "See Showcase", href: "/showcase" },
	},
} as const;

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
