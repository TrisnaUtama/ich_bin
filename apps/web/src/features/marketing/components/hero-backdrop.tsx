import { GrainOverlay } from "#/components/ui/grain-overlay";
import { cn } from "#/lib/utils/cn";

type HeroBackdropProps = {
	className?: string;
	src?: string;
};

export function HeroBackdrop({ className, src }: HeroBackdropProps) {
	return (
		<div
			aria-hidden
			className={cn("absolute inset-0 overflow-hidden bg-ember-500", className)}
		>
			{src ? (
				<img
					src={src}
					alt=""
					className="absolute inset-0 size-full object-cover object-center"
				/>
			) : (
				<>
					<div className="absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(180deg,#ffe3ab_0%,#ffc169_55%,#ffab3e_100%)] [clip-path:polygon(0_0,100%_0,100%_72%,88%_100%,12%_100%,0_72%)]" />
					<div className="absolute left-1/2 top-0 h-[46%] w-[85%] -translate-x-1/2 rounded-b-[50%] bg-[radial-gradient(ellipse_at_top,rgba(255,236,190,0.85),rgba(255,180,90,0.25)_55%,transparent_78%)] blur-2xl" />

					<div className="absolute inset-0">
						<div className="absolute bottom-[9%] left-1/2 h-[9%] w-[70%] -translate-x-1/2 rotate-[-7deg] rounded-full bg-[#6d2502]/55 blur-3xl" />
						<div className="absolute bottom-[6%] left-[36%] h-[7%] w-[52%] rotate-10 rounded-full bg-[#5d1e01]/50 blur-3xl" />
						<div className="absolute bottom-[11%] left-[50%] h-[5%] w-[26%] -translate-x-1/2 rounded-full bg-[#3d1200]/60 blur-2xl" />

						<div className="absolute bottom-[12%] left-[51%] h-[34%] w-[27%] -translate-x-1/2 blur-sm sm:h-[44%] sm:w-[15%] lg:h-[50%] lg:w-[8.5%]">
							<div className="absolute inset-x-[24%] top-0 aspect-square rounded-[44%] bg-[#250c00]/92" />
							<div className="absolute inset-x-[10%] top-[16%] h-[48%] rounded-[40%_40%_24%_24%] bg-[#1f0900]/94" />
							<div className="absolute bottom-0 left-[24%] h-[44%] w-[23%] rounded-b-[40%] bg-[#1b0800]/92" />
							<div className="absolute bottom-0 right-[22%] h-[46%] w-[25%] rounded-b-[40%] bg-[#170700]/94" />
							<div className="absolute bottom-[-1%] left-[14%] h-[7%] w-[40%] rounded-full bg-[#120500]/95" />
						</div>

						<div className="absolute bottom-[12%] left-[51%] h-[34%] w-[33%] translate-x-[-44%] scale-x-[1.15] blur-[30px] sm:h-[44%] sm:w-[19%] lg:h-[50%] lg:w-[11%]">
							<div className="absolute inset-x-[18%] top-[3%] h-[42%] rounded-[40%] bg-[#2e1000]/55" />
							<div className="absolute inset-x-[22%] bottom-0 h-[48%] rounded-[30%] bg-[#280d00]/50" />
						</div>
					</div>

					<div className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(180deg,rgba(214,86,10,0)_0%,rgba(150,47,4,0.5)_40%,rgba(58,18,2,0.9)_100%)]" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_35%,rgba(120,40,2,0.35)_100%)]" />
				</>
			)}

			{/* black fade at the bottom — now always renders, image or fallback */}
			<div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_45%,rgba(0,0,0,0.85)_80%,#000_100%)]" />

			<GrainOverlay opacity={0.2} />
		</div>
	);
}
