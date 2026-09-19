import { motion } from "motion/react";
import { auth } from "#/content/site";
import { fadeUp } from "#/lib/animations";

export function TestimonialCard() {
	const { quote, author, role } = auth.testimonial;
	const initials = author
		.split(" ")
		.map((part) => part[0])
		.join("");

	return (
		<motion.figure
			variants={fadeUp}
			className="rounded-2xl bg-white/14 p-5 ring-1 ring-inset ring-white/25 backdrop-blur-xl sm:p-6"
		>
			<blockquote className="text-[13px] leading-relaxed text-white/95 sm:text-sm">
				&ldquo;{quote}&rdquo;
			</blockquote>

			<figcaption className="mt-4 flex items-center gap-2.5">
				<span className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(140deg,#1f2937,#4b5563)] text-[10px] font-bold text-white ring-1 ring-inset ring-white/40">
					{initials}
				</span>
				<span className="text-[13px] font-semibold text-white">{author}</span>
				<span className="text-[13px] text-white/70">&middot; {role}</span>
			</figcaption>
		</motion.figure>
	);
}
