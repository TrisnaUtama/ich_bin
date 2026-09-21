import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Application } from "pixi.js";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	ColorField,
	Section,
	Select,
	Slider,
	Tabs,
	TextField,
} from "#/components/control";
import { BrandMark } from "#/components/ui/brand-mark";
import { GradientPresetGrid } from "#/components/ui/gradient-preset-grid";
import { CloseIcon, MenuIcon } from "#/components/ui/icons";
import { LanguageSwitcher } from "#/components/ui/language-switcher";
import { type EditorState, makeInitialState } from "#/engine/editorState";
import { EFFECT_REGISTRY } from "#/engine/effects";
import {
	BLEND_MODES,
	IMAGE_CONTROL_REGISTRY,
	TEXTURE_CATALOG,
} from "#/engine/registry";
import { TemplateEngine } from "#/engine/TemplateEngine";
import { DEFAULT_TEMPLATE, TEMPLATE_LIST } from "#/engine/templateList";
import type { Template } from "#/engine/type";
import { UserMenu } from "#/features/auth";
import { useTranslation } from "#/i18n/useTranslation";
import type { GradientPreset } from "#/lib/gradient-presets";
import { GRADIENT_PRESETS } from "#/lib/gradient-presets";
import { cn } from "#/lib/utils/cn";
import { useAuthStore } from "#/stores/auth-store";

export const Route = createFileRoute("/editor")({
	beforeLoad: () => {
		if (!useAuthStore.getState().isAuthenticated) {
			throw redirect({ to: "/login" });
		}
	},
	component: Editor,
	validateSearch: (search: Record<string, unknown>) => ({
		template: (search.template as string) || DEFAULT_TEMPLATE,
	}),
});

function Editor() {
	const { template: templateId } = Route.useSearch();
	const navigate = Route.useNavigate();
	const { t } = useTranslation();

	const mountRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<TemplateEngine | null>(null);
	const [template, setTemplate] = useState<Template | null>(null);
	const [state, setState] = useState<EditorState | null>(null);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [imageControlsOpen, setImageControlsOpen] = useState(false);
	const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
	const dragRef = useRef<{
		startX: number;
		startY: number;
		originX: number;
		originY: number;
	} | null>(null);

	const onDragStart = useCallback(
		(e: React.MouseEvent | React.TouchEvent) => {
			e.preventDefault();
			const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
			const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
			const cur = dragPos ?? { x: 0, y: 0 };
			dragRef.current = {
				startX: clientX,
				startY: clientY,
				originX: cur.x,
				originY: cur.y,
			};

			const onMove = (ev: MouseEvent | TouchEvent) => {
				if (!dragRef.current) return;
				const cx =
					"touches" in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX;
				const cy =
					"touches" in ev ? ev.touches[0].clientY : (ev as MouseEvent).clientY;
				setDragPos({
					x: dragRef.current.originX + (cx - dragRef.current.startX),
					y: dragRef.current.originY + (cy - dragRef.current.startY),
				});
			};
			const onUp = () => {
				dragRef.current = null;
				window.removeEventListener("mousemove", onMove);
				window.removeEventListener("mouseup", onUp);
				window.removeEventListener("touchmove", onMove);
				window.removeEventListener("touchend", onUp);
			};
			window.addEventListener("mousemove", onMove);
			window.addEventListener("mouseup", onUp);
			window.addEventListener("touchmove", onMove);
			window.addEventListener("touchend", onUp);
		},
		[dragPos],
	);

	useEffect(() => {
		let app: Application | null = null;
		let destroyed = false;
		const mount = mountRef.current;
		if (!mount) return;

		setTemplate(null);
		setState(null);
		engineRef.current = null;

		(async () => {
			try {
				const tpl: Template = await fetch(`/templates/${templateId}.json`).then(
					(r) => r.json(),
				);
				app = new Application();
				await app.init({
					width: tpl.canvas.width,
					height: tpl.canvas.height,
					background: "#08080a",
					antialias: true,
				});
				if (destroyed) return app.destroy(true);

				app.canvas.style.width = "100%";
				app.canvas.style.height = "auto";
				app.canvas.style.display = "block";
				mount.appendChild(app.canvas);

				const engine = new TemplateEngine(app, tpl);
				await engine.build({ image: "/sample.png" });
				if (destroyed) return app.destroy(true);

				const initial = makeInitialState(tpl);
				await engine.setTexture(initial.background.texture?.name ?? "none");

				engineRef.current = engine;
				setTemplate(tpl);
				setState(initial);
			} catch (err) {
				console.error("❌ init editor:", err);
			}
		})();

		return () => {
			destroyed = true;
			engineRef.current = null;
			if (app) app.destroy(true, { children: true });
		};
	}, [templateId]);

	useEffect(() => {
		if (engineRef.current && state) engineRef.current.sync(state);
	}, [state]);

	const patch = (fn: (s: EditorState) => EditorState) =>
		setState((p) => (p ? fn(p) : p));
	const setSection = (k: keyof EditorState["sections"], v: boolean) =>
		patch((s) => ({ ...s, sections: { ...s.sections, [k]: v } }));
	const setBg = (b: Partial<EditorState["background"]>) =>
		patch((s) => ({ ...s, background: { ...s.background, ...b } }));
	const setImg = (k: keyof EditorState["image"], v: number) =>
		patch((s) => ({ ...s, image: { ...s.image, [k]: v } }));
	const setText = (slot: string, p: Partial<EditorState["texts"][string]>) =>
		patch((s) => ({
			...s,
			texts: { ...s.texts, [slot]: { ...s.texts[slot], ...p } },
		}));
	const setEffect = (id: string, key: string, v: number) =>
		patch((s) => ({
			...s,
			effects: {
				...s.effects,
				[id]: {
					...s.effects[id],
					params: { ...s.effects[id].params, [key]: v },
				},
			},
		}));
	const setMask = (p: Partial<NonNullable<EditorState["mask"]>>) =>
		patch((s) => (s.mask ? { ...s, mask: { ...s.mask, ...p } } : s));
	const setTextFill = (p: Partial<NonNullable<EditorState["textFill"]>>) =>
		patch((s) =>
			s.textFill ? { ...s, textFill: { ...s.textFill, ...p } } : s,
		);

	const onReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !engineRef.current) return;
		const reader = new FileReader();
		reader.onload = async () => {
			await engineRef.current!.setImage(reader.result as string);
			patch((s) => ({ ...s }));
		};
		reader.readAsDataURL(file);
	};

	const applyGradientPreset = (preset: GradientPreset) => {
		if (!state) return;
		setBg({
			gradient: {
				...state.background.gradient,
				angle: preset.angle,
				stops: preset.stops.map((s) => ({ ...s })),
			},
		});
	};

	const activeGradientPresetId = (() => {
		if (!state) return undefined;
		const { angle, stops } = state.background.gradient;
		return GRADIENT_PRESETS.find(
			(p) =>
				p.angle === angle &&
				p.stops.length === stops.length &&
				p.stops.every((s, i) => s.color === stops[i]?.color),
		)?.id;
	})();

	const onPickTexture = async (name: string) => {
		if (!state) return;
		await engineRef.current?.setTexture(name);
		setBg({
			texture: {
				...(state.background.texture ?? {
					blendMode: "multiply",
					opacity: 70,
					fill: 100,
				}),
				name,
			},
		});
	};

	const hasEffects = state ? Object.keys(state.effects).length > 0 : false;

	useEffect(() => {
		document.title = template
			? `${template.name} — ZINEFORGE Editor`
			: "Editor — ZINEFORGE";
	}, [template]);

	const sidebar = template && state && (
		<>
			<h2 className="hidden text-lg font-semibold text-white lg:block">
				{t("editor.editor")}
			</h2>

			{/* Source Asset */}
			<Section
				title={t("editor.sourceAsset")}
				enabled={state.sections.source}
				onToggle={(v) => setSection("source", v)}
			>
				<label className="group block cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/15 transition-colors hover:border-primary-500/60">
					<div className="flex items-center gap-3 px-4 py-4">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-white/30 transition-colors group-hover:bg-primary-500/10 group-hover:text-primary-400">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
								<circle cx="8.5" cy="8.5" r="1.5" />
								<polyline points="21 15 16 10 5 21" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-medium text-white/70 transition-colors group-hover:text-white/90">
								{t("editor.clickToReplace")}
							</p>
							<p className="text-[11px] text-white/30">PNG, JPG, WebP</p>
						</div>
					</div>
					<input
						type="file"
						accept="image/*"
						className="hidden"
						onChange={onReplace}
					/>
				</label>
			</Section>

			{/* Effect Parameters — only shown if template has effects */}
			{hasEffects && (
				<Section
					title={t("editor.effectParameters")}
					enabled={state.sections.effects}
					onToggle={(v) => setSection("effects", v)}
				>
					{Object.entries(state.effects).map(([id, fx]) =>
						Object.entries(fx.params).map(([key, val]) => {
							const d = EFFECT_REGISTRY[fx.type]?.params[key];
							if (d?.kind === "select" && d.options) {
								return (
									<label key={`${id}-${key}`} className="block space-y-1">
										<span className="text-xs text-white/45">{d.label}</span>
										<select
											value={val}
											onChange={(e) =>
												setEffect(id, key, Number(e.target.value))
											}
											className="w-full rounded-xl border border-white/10 bg-ink-800 px-3 py-2 text-sm text-white outline-none transition-colors focus:border-primary-500"
										>
											{d.options.map((o) => (
												<option key={o.value} value={o.value}>
													{o.label}
												</option>
											))}
										</select>
									</label>
								);
							}
							return (
								<Slider
									key={`${id}-${key}`}
									label={d?.label ?? `${fx.type} · ${key}`}
									value={val}
									min={d?.min ?? 0}
									max={d?.max ?? 10}
									step={d?.step ?? 0.1}
									onChange={(v) => setEffect(id, key, v)}
								/>
							);
						}),
					)}
				</Section>
			)}

			{/* Mask Text */}
			{state.mask && (
				<Section title={t("editor.maskText")}>
					<TextField
						value={state.mask.text}
						onChange={(v) => setMask({ text: v })}
					/>
					<Select
						value={state.mask.font}
						options={template.fonts}
						onChange={(v) => setMask({ font: v })}
					/>
					<Slider
						label={t("editor.size")}
						value={state.mask.size}
						min={40}
						max={800}
						step={1}
						onChange={(v) => setMask({ size: v })}
					/>
				</Section>
			)}

			{/* Text Fill */}
			{state.textFill && (
				<Section title={t("editor.textFill")}>
					<TextField
						value={state.textFill.text}
						onChange={(v) => setTextFill({ text: v })}
					/>
					<Select
						value={state.textFill.font}
						options={template.fonts}
						onChange={(v) => setTextFill({ font: v })}
					/>
					<Slider
						label={t("editor.size")}
						value={state.textFill.size}
						min={8}
						max={60}
						step={1}
						onChange={(v) => setTextFill({ size: v })}
					/>
					<Slider
						label={t("editor.lineHeight")}
						value={state.textFill.lineHeight}
						min={8}
						max={60}
						step={1}
						onChange={(v) => setTextFill({ lineHeight: v })}
					/>
					<ColorField
						label={t("editor.color")}
						value={state.textFill.color}
						onChange={(v) => setTextFill({ color: v })}
					/>
					<div>
						<p className="mb-1 text-xs text-white/45">{t("editor.mode")}</p>
						<Tabs
							value={state.textFill.mode}
							options={["inner", "outer"]}
							onChange={(v) => setTextFill({ mode: v as "inner" | "outer" })}
						/>
					</div>
				</Section>
			)}

			{/* Typography */}
			<Section
				title={t("editor.typography")}
				enabled={state.sections.typography}
				onToggle={(v) => setSection("typography", v)}
			>
				{template.layers
					.filter(
						(l): l is Extract<typeof l, { type: "text" }> => l.type === "text",
					)
					.map((layer) => {
						const t2 = state.texts[layer.slot];
						return (
							<div
								key={layer.slot}
								className="space-y-2 rounded-xl bg-ink-800/60 p-3"
							>
								<p className="text-xs text-white/45">{layer.label}</p>
								<TextField
									value={t2.value}
									onChange={(v) => setText(layer.slot, { value: v })}
								/>
								<Select
									value={t2.font}
									options={template.fonts}
									onChange={(v) => setText(layer.slot, { font: v })}
								/>
								<Slider
									label={t("editor.size")}
									value={t2.size}
									min={8}
									max={200}
									step={1}
									onChange={(v) => setText(layer.slot, { size: v })}
								/>
								<Slider
									label={t("editor.letterSpacing")}
									value={t2.letterSpacing}
									min={0}
									max={20}
									step={0.1}
									onChange={(v) => setText(layer.slot, { letterSpacing: v })}
								/>
								<ColorField
									label={t("editor.color")}
									value={t2.color}
									onChange={(v) => setText(layer.slot, { color: v })}
								/>
							</div>
						);
					})}
			</Section>

			{/* Canvas Settings */}
			<Section
				title={t("editor.canvasSettings")}
				enabled={state.sections.canvas}
				onToggle={(v) => setSection("canvas", v)}
			>
				<Tabs
					value={state.background.kind}
					options={["solid", "gradient"]}
					onChange={(v) => setBg({ kind: v as "solid" | "gradient" })}
				/>
				{state.background.kind === "solid" ? (
					<ColorField
						label={t("editor.color")}
						value={state.background.color}
						onChange={(v) => setBg({ color: v })}
					/>
				) : (
					<div className="space-y-3">
						<GradientPresetGrid
							activeId={activeGradientPresetId}
							onSelect={applyGradientPreset}
						/>
						{state.background.gradient.stops.map((stop, i) => (
							<ColorField
								key={`stop-${i}`}
								label={`${t("editor.stop")} ${i + 1} (${Math.round(stop.position * 100)}%)`}
								value={stop.color}
								onChange={(v) =>
									setBg({
										gradient: {
											...state.background.gradient,
											stops: state.background.gradient.stops.map((s, j) =>
												j === i ? { ...s, color: v } : s,
											),
										},
									})
								}
							/>
						))}
						<Slider
							label={t("editor.angle")}
							value={state.background.gradient.angle}
							min={0}
							max={360}
							step={1}
							onChange={(v) =>
								setBg({
									gradient: { ...state.background.gradient, angle: v },
								})
							}
						/>
					</div>
				)}

				{state.background.texture && (
					<div className="space-y-3 rounded-xl border border-white/10 p-3">
						<p className="text-xs font-medium text-white/60">
							{t("editor.selectTexture")}
						</p>
						<div className="grid grid-cols-4 gap-2">
							{TEXTURE_CATALOG.map((tex) => {
								const active = state.background.texture?.name === tex.name;
								return (
									<button
										key={tex.name}
										type="button"
										onClick={() => onPickTexture(tex.name)}
										className={`overflow-hidden rounded-lg border-2 transition-colors ${active ? "border-primary-500" : "border-white/10 hover:border-white/25"}`}
									>
										{tex.name === "none" ? (
											<div className="grid h-12 place-items-center text-[10px] text-white/40">
												{t("editor.none")}
											</div>
										) : (
											<img
												src={`/textures/${tex.name}.png`}
												alt={tex.label}
												className="h-12 w-full object-cover"
											/>
										)}
										<span className="block truncate px-1 py-0.5 text-[9px] text-white/45">
											{tex.label}
										</span>
									</button>
								);
							})}
						</div>

						{state.background.texture.name !== "none" && (
							<div className="space-y-2 border-t border-white/10 pt-3">
								<div className="flex items-center justify-between">
									<span className="text-xs text-white/45">
										{t("editor.blendMode")}
									</span>
									<div className="w-32">
										<Select
											value={state.background.texture.blendMode}
											options={BLEND_MODES}
											onChange={(v) =>
												setBg({
													texture: {
														...state.background.texture!,
														blendMode: v as never,
													},
												})
											}
										/>
									</div>
								</div>
								<Slider
									label={`${t("editor.opacity")} ${state.background.texture.opacity}%`}
									value={state.background.texture.opacity}
									min={0}
									max={100}
									step={1}
									onChange={(v) =>
										setBg({
											texture: { ...state.background.texture!, opacity: v },
										})
									}
								/>
								<Slider
									label={`${t("editor.fill")} ${state.background.texture.fill}%`}
									value={state.background.texture.fill}
									min={0}
									max={100}
									step={1}
									onChange={(v) =>
										setBg({
											texture: { ...state.background.texture!, fill: v },
										})
									}
								/>
							</div>
						)}
					</div>
				)}
			</Section>

			{/* Export Button */}
			<button
				type="button"
				onClick={() => engineRef.current?.exportPNG()}
				className="primary-gradient w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-[0_14px_34px_-14px_rgba(238,61,11,0.8)] ring-1 ring-inset ring-white/10 transition-transform active:scale-[0.98]"
			>
				{t("editor.export").toUpperCase()}
			</button>
		</>
	);

	return (
		<div className="flex h-svh flex-col overflow-hidden bg-ink-950 text-white/80">
			{/* ── TOP BAR ── */}
			<div className="relative z-40 flex items-center gap-3 border-b border-white/[0.06] bg-ink-950 px-4 py-2.5 sm:px-5">
				<Link to="/" className="shrink-0">
					<BrandMark className="text-sm" />
				</Link>

				<span className="hidden h-5 w-px bg-white/10 md:block" />

				<h1 className="hidden max-w-40 truncate text-sm text-white/50 md:block">
					{template?.name ?? t("editor.loading")}
				</h1>

				<select
					value={templateId}
					onChange={(e) => navigate({ search: { template: e.target.value } })}
					className="rounded-lg border border-white/[0.08] bg-ink-900 px-3 py-1.5 text-xs text-white/80 outline-none transition-colors focus:border-primary-500"
				>
					{TEMPLATE_LIST.map((tpl) => (
						<option key={tpl.id} value={tpl.id}>
							{tpl.name}
						</option>
					))}
				</select>

				{template && state && (
					<div className="hidden sm:block sm:w-36">
						<Tabs
							value={state.aspectRatio}
							options={template.aspectRatios}
							onChange={(v) => patch((s) => ({ ...s, aspectRatio: v }))}
						/>
					</div>
				)}

				<div className="ml-auto flex items-center gap-2">
					<LanguageSwitcher className="hidden md:block" />
					<UserMenu />
					{template && state && (
						<button
							type="button"
							onClick={() => setSidebarOpen(true)}
							aria-label={t("editor.editor")}
							className="inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-ink-900 text-white/60 transition-colors hover:text-white lg:hidden"
						>
							<MenuIcon className="size-4" />
						</button>
					)}
				</div>
			</div>

			<div className="relative flex flex-1 overflow-hidden">
				{/* ── CANVAS AREA ── */}
				<div className="relative flex flex-1 items-center justify-center overflow-hidden">
					{/* Subtle ambient glow behind canvas */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(238,61,11,0.04),transparent_65%)]"
					/>

					{/* Checkerboard / subtle grid pattern */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 opacity-[0.015]"
						style={{
							backgroundImage:
								"radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
							backgroundSize: "24px 24px",
						}}
					/>

					<div className="relative flex h-full w-full items-center justify-center p-6 sm:p-10 lg:p-14">
						<div
							ref={mountRef}
							className="relative w-full max-w-[560px] overflow-hidden rounded-2xl shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.08]"
						/>
					</div>

					{/* ── FLOATING IMAGE CONTROLS (draggable) ── */}
					{template && state && (
						<div
							className="absolute bottom-5 right-5 z-30"
							style={
								dragPos
									? { transform: `translate(${dragPos.x}px, ${dragPos.y}px)` }
									: undefined
							}
						>
							<AnimatePresence>
								{imageControlsOpen && (
									<motion.div
										initial={{ opacity: 0, y: 12, scale: 0.95 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: 12, scale: 0.95 }}
										transition={{ type: "spring", stiffness: 400, damping: 30 }}
										className="mb-3 w-[300px] overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-950/90 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] backdrop-blur-xl"
									>
										{/* Drag handle */}
										<div
											onMouseDown={onDragStart}
											onTouchStart={onDragStart}
											className="flex cursor-grab items-center justify-between border-b border-white/[0.06] px-4 py-2.5 active:cursor-grabbing"
										>
											<span className="text-xs font-medium text-white/50">
												{t("editor.imageControls")}
											</span>
											<div className="flex items-center gap-2">
												<svg
													width="14"
													height="14"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="text-white/20"
												>
													<circle cx="8" cy="6" r="2" />
													<circle cx="16" cy="6" r="2" />
													<circle cx="8" cy="12" r="2" />
													<circle cx="16" cy="12" r="2" />
													<circle cx="8" cy="18" r="2" />
													<circle cx="16" cy="18" r="2" />
												</svg>
												<button
													type="button"
													onClick={() => setImageControlsOpen(false)}
													className="inline-flex size-6 items-center justify-center rounded-md text-white/30 transition-colors hover:bg-white/10 hover:text-white/60"
												>
													<CloseIcon className="size-3" />
												</button>
											</div>
										</div>

										<div className="max-h-[50vh] space-y-3 overflow-y-auto p-4">
											{Object.entries(IMAGE_CONTROL_REGISTRY)
												.filter(([key]) =>
													state.textFill
														? ["scale", "rotation", "opacity"].includes(key)
														: true,
												)
												.map(([key, d]) => (
													<Slider
														key={key}
														label={d.label}
														value={
															state.image[key as keyof EditorState["image"]]
														}
														min={d.min}
														max={d.max}
														step={d.step}
														onChange={(v) =>
															setImg(key as keyof EditorState["image"], v)
														}
													/>
												))}
										</div>
									</motion.div>
								)}
							</AnimatePresence>

							<button
								type="button"
								onClick={() => setImageControlsOpen((v) => !v)}
								className={cn(
									"inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium shadow-[0_8px_30px_-8px_rgba(0,0,0,0.7)] ring-1 ring-inset backdrop-blur-xl transition-all",
									imageControlsOpen
										? "bg-primary-500/20 text-primary-300 ring-primary-500/30"
										: "bg-ink-900/80 text-white/60 ring-white/[0.08] hover:text-white/80",
								)}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<circle cx="12" cy="12" r="3" />
									<path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m17.36-5.64l-4.24 4.24m-2.24-2.24L6.64 6.64m0 10.72l4.24-4.24m2.24 2.24l4.24 4.24" />
								</svg>
								{t("editor.imageControls")}
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									className={cn(
										"transition-transform duration-200",
										imageControlsOpen ? "rotate-180" : "",
									)}
								>
									<polyline points="18 15 12 9 6 15" />
								</svg>
							</button>
						</div>
					)}
				</div>

				{/* ── SIDEBAR — desktop inline panel ── */}
				{sidebar && (
					<aside className="hidden h-full w-[340px] shrink-0 space-y-3 overflow-y-auto border-l border-white/[0.06] bg-ink-950/80 p-4 backdrop-blur-sm lg:block">
						{sidebar}
					</aside>
				)}
			</div>

			{/* ── SIDEBAR — mobile / tablet drawer ── */}
			<AnimatePresence>
				{sidebarOpen && sidebar ? (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							onClick={() => setSidebarOpen(false)}
							className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
						/>
						<motion.aside
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", stiffness: 320, damping: 34 }}
							className="fixed inset-y-0 right-0 z-[91] w-full max-w-sm space-y-3 overflow-y-auto bg-ink-950 p-4 shadow-[0_0_80px_rgba(0,0,0,0.6)] ring-1 ring-inset ring-white/10 lg:hidden"
						>
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-white">
									{t("editor.editor")}
								</h2>
								<button
									type="button"
									onClick={() => setSidebarOpen(false)}
									className="inline-flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
								>
									<CloseIcon className="size-4" />
								</button>
							</div>

							{/* Image Controls inline in mobile drawer */}
							<Section title={t("editor.imageControls")}>
								{Object.entries(IMAGE_CONTROL_REGISTRY)
									.filter(([key]) =>
										state?.textFill
											? ["scale", "rotation", "opacity"].includes(key)
											: true,
									)
									.map(([key, d]) => (
										<Slider
											key={key}
											label={d.label}
											value={
												state?.image[key as keyof EditorState["image"]] ??
												d.default
											}
											min={d.min}
											max={d.max}
											step={d.step}
											onChange={(v) =>
												setImg(key as keyof EditorState["image"], v)
											}
										/>
									))}
							</Section>

							{sidebar}
						</motion.aside>
					</>
				) : null}
			</AnimatePresence>
		</div>
	);
}
