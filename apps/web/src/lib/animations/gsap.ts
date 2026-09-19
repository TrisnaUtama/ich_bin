import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export const EASE = {
	expo: "expo.out",
	power: "power3.out",
	soft: "power2.inOut",
} as const;

export { gsap, ScrollTrigger, useGSAP };
