import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	hexToHsv,
	hsvToHex,
	isValidHex,
	normalizeHex,
	readableTextColor,
} from "#/lib/color";
import { cn } from "#/lib/utils/cn";

export const SWATCH_PRESETS = [
	"#ee3d0b",
	"#f96438",
	"#ffb057",
	"#ffe6c2",
	"#f4442e",
	"#d92d1a",
	"#9a260c",
	"#4a1408",
	"#5b1a86",
	"#c23bd6",
	"#241f7a",
	"#5a6bff",
	"#1f3350",
	"#3fd6c9",
	"#20461f",
	"#8fd166",
	"#ffffff",
	"#e6e6ea",
	"#8a8a92",
	"#0e0e11",
] as const;

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, onOutside: () => void, active: boolean) {
	useEffect(() => {
		if (!active) return;
		const onClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) onOutside();
		};
		document.addEventListener("mousedown", onClick);
		return () => document.removeEventListener("mousedown", onClick);
	}, [active, onOutside, ref]);
}

export function ColorPicker({
	value,
	onChange,
	label,
}: {
	value: string;
	onChange: (hex: string) => void;
	label?: string;
}) {
	const [open, setOpen] = useState(false);
	const [hexDraft, setHexDraft] = useState(value);
	const rootRef = useRef<HTMLDivElement>(null);
	const svRef = useRef<HTMLDivElement>(null);
	const hueRef = useRef<HTMLDivElement>(null);
	const draggingRef = useRef<"sv" | "hue" | null>(null);

	const safeValue = isValidHex(value) ? normalizeHex(value) : "#000000";
	const hsv = useMemo(() => hexToHsv(safeValue), [safeValue]);

	useOutsideClick(rootRef, () => setOpen(false), open);

	useEffect(() => {
		setHexDraft(safeValue);
	}, [safeValue]);

	const applyFromSv = (clientX: number, clientY: number) => {
		const el = svRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
		onChange(hsvToHex({ h: hsv.h, s: x, v: 1 - y }));
	};

	const applyFromHue = (clientX: number) => {
		const el = hueRef.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		onChange(hsvToHex({ h: x * 360, s: hsv.s, v: hsv.v }));
	};

	useEffect(() => {
		if (!open) return;
		const onMove = (e: MouseEvent) => {
			if (draggingRef.current === "sv") applyFromSv(e.clientX, e.clientY);
			else if (draggingRef.current === "hue") applyFromHue(e.clientX);
		};
		const onUp = () => {
			draggingRef.current = null;
		};
		window.addEventListener("mousemove", onMove);
		window.addEventListener("mouseup", onUp);
		return () => {
			window.removeEventListener("mousemove", onMove);
			window.removeEventListener("mouseup", onUp);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, hsv.h, hsv.s, hsv.v]);

	const commitHex = (raw: string) => {
		setHexDraft(raw);
		if (isValidHex(raw)) onChange(normalizeHex(raw));
	};

	return (
		<div ref={rootRef} className="relative">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-label={label ?? "Pick color"}
				className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/15 shadow-inner transition-transform active:scale-95"
				style={{ backgroundColor: safeValue }}
			>
				<span className="sr-only">{safeValue}</span>
			</button>

			<AnimatePresence>
				{open ? (
					<motion.div
						initial={{ opacity: 0, y: -8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -8, scale: 0.96 }}
						transition={{ duration: 0.15, ease: "easeOut" }}
						className="absolute right-0 top-[calc(100%+8px)] z-[70] w-64 rounded-2xl bg-ink-900/95 p-3.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.75)] ring-1 ring-inset ring-white/15 backdrop-blur-xl"
					>
						{/* Saturation / Value field */}
						<div
							ref={svRef}
							onMouseDown={(e) => {
								draggingRef.current = "sv";
								applyFromSv(e.clientX, e.clientY);
							}}
							className="relative h-32 w-full cursor-crosshair overflow-hidden rounded-xl"
							style={{
								backgroundColor: `hsl(${hsv.h}, 100%, 50%)`,
								backgroundImage:
									"linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
							}}
						>
							<span
								className="pointer-events-none absolute size-3.5 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
								style={{
									left: `${hsv.s * 100}%`,
									bottom: `${hsv.v * 100}%`,
								}}
							/>
						</div>

						{/* Hue slider */}
						<div
							ref={hueRef}
							onMouseDown={(e) => {
								draggingRef.current = "hue";
								applyFromHue(e.clientX);
							}}
							className="relative mt-3 h-3 w-full cursor-pointer rounded-full"
							style={{
								backgroundImage:
									"linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
							}}
						>
							<span
								className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/10 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
								style={{ left: `${(hsv.h / 360) * 100}%` }}
							/>
						</div>

						{/* Hex input */}
						<div className="mt-3 flex items-center gap-2">
							<span
								className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 text-[10px] font-semibold"
								style={{ backgroundColor: safeValue, color: readableTextColor(safeValue) }}
							>
								#
							</span>
							<input
								value={hexDraft}
								onChange={(e) => commitHex(e.target.value)}
								onBlur={() => setHexDraft(safeValue)}
								spellCheck={false}
								className="w-full rounded-lg border border-white/10 bg-ink-800 px-2.5 py-1.5 text-sm uppercase tracking-wide text-white outline-none transition-colors focus:border-primary-500"
							/>
						</div>

						{/* Preset swatches */}
						<div className="mt-3 grid grid-cols-10 gap-1.5">
							{SWATCH_PRESETS.map((swatch) => (
								<button
									key={swatch}
									type="button"
									onClick={() => onChange(swatch)}
									className={cn(
										"size-5 rounded-md ring-1 ring-inset ring-white/15 transition-transform hover:scale-110",
										safeValue === swatch && "ring-2 ring-primary-400",
									)}
									style={{ backgroundColor: swatch }}
									aria-label={swatch}
								/>
							))}
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
