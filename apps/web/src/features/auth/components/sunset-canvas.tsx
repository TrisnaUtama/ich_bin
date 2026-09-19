import { GrainOverlay } from "#/components/ui/grain-overlay";
import { cn } from "#/lib/utils/cn";

type SunsetCanvasProps = {
	className?: string;
	src?: string;
};

export function SunsetCanvas({ className, src }: SunsetCanvasProps) {
	return (
		<div
			aria-hidden
			className={cn("absolute inset-0 overflow-hidden", className)}
		>
			{src ? (
				<>
					<img
						src={src}
						alt=""
						className="absolute inset-0 size-full object-cover object-center"
					/>
					<div className="absolute inset-x-0 bottom-0 h-[45%] bg-[linear-gradient(180deg,rgba(40,12,2,0)_0%,rgba(40,12,2,0.35)_45%,rgba(28,8,1,0.72)_100%)]" />
				</>
			) : (
				<>
					<div className="absolute inset-0 bg-[linear-gradient(180deg,#bd6e2c_0%,#cf7c2b_13%,#e28c27_27%,#f59a26_40%,#ffa62f_52%,#f9982a_64%,#e08121_76%,#a9661d_88%,#4f3411_100%)]" />

					<div className="absolute left-[10%] top-[5%] h-[7%] w-[44%] rounded-full bg-[#ffd9a8]/45 blur-xl" />
					<div className="absolute left-[48%] top-[10%] h-[5%] w-[40%] rounded-full bg-[#ffe3bd]/38 blur-xl" />
					<div className="absolute left-[2%] top-[16%] h-[4%] w-[32%] rounded-full bg-[#ffd9a8]/26 blur-xl" />
					<div className="absolute left-[30%] top-[21%] h-[4%] w-[46%] rounded-full bg-[#ffe9cb]/22 blur-xl" />

					<div className="absolute left-[-20%] top-[46%] h-[9%] w-[140%] rotate-[-4deg] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,232,180,0)_0%,rgba(255,247,226,0.85)_50%,rgba(255,168,66,0)_100%)] blur-md" />
					<div className="absolute left-[-16%] top-[57%] h-[7%] w-[136%] rotate-[3deg] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,251,238,0.92)_50%,rgba(255,160,58,0)_100%)] blur-md" />
					<div className="absolute left-[-12%] top-[66%] h-[6%] w-[132%] rotate-[-2deg] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,240,206,0.7)_50%,rgba(236,138,42,0)_100%)] blur-md" />
					<div className="absolute left-[-8%] top-[74%] h-[5%] w-[126%] rotate-[2deg] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,226,178,0.48)_50%,rgba(202,110,30,0)_100%)] blur-sm" />
					<div className="absolute left-[-4%] top-[80%] h-[4%] w-[120%] rotate-[-1deg] rounded-[50%] bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,212,152,0.3)_50%,rgba(176,92,24,0)_100%)] blur-sm" />

					<div className="absolute inset-x-[-12%] bottom-[-10%] h-[28%] rotate-[-4deg] rounded-t-[46%] bg-[linear-gradient(180deg,rgba(158,102,30,0.35)_0%,#7a5018_26%,#4a3110_62%,#33220b_100%)]" />
					<div className="absolute inset-x-[-12%] bottom-[-10%] h-[26%] rotate-[-4deg] rounded-t-[46%] bg-[repeating-linear-gradient(74deg,rgba(255,196,110,0.22)_0px,rgba(255,196,110,0.22)_1px,transparent_1px,transparent_4px)] opacity-80" />

					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,transparent_48%,rgba(96,54,12,0.34)_100%)]" />
				</>
			)}

			<GrainOverlay opacity={0.14} />
		</div>
	);
}
