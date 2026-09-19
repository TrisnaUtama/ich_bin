import { createFileRoute } from "@tanstack/react-router";
import { Application } from "pixi.js";
import { useEffect, useRef, useState } from "react";
import {
	ColorField,
	Section,
	Select,
	Slider,
	Tabs,
	TextField,
} from "#/components/control";
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

export const Route = createFileRoute("/editor")({
	component: Editor,
	validateSearch: (search: Record<string, unknown>) => ({
		template: (search.template as string) || DEFAULT_TEMPLATE,
	}),
});

function Editor() {
	const { template: templateId } = Route.useSearch();
	const navigate = Route.useNavigate();

	const mountRef = useRef<HTMLDivElement>(null);
	const engineRef = useRef<TemplateEngine | null>(null);
	const [template, setTemplate] = useState<Template | null>(null);
	const [state, setState] = useState<EditorState | null>(null);

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
					background: "#000",
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

	return (
		<div className="flex h-screen overflow-hidden bg-neutral-950 text-neutral-200">
			{/* CANVAS */}
			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="flex items-center gap-3 border-b border-neutral-800 p-4">
					<h1 className="font-semibold">{template?.name ?? "Memuat…"}</h1>
					<select
						value={templateId}
						onChange={(e) => navigate({ search: { template: e.target.value } })}
						className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm text-neutral-100 outline-none focus:border-teal-500"
					>
						{TEMPLATE_LIST.map((t) => (
							<option key={t.id} value={t.id}>
								{t.name}
							</option>
						))}
					</select>
					{template && state && (
						<div className="ml-auto w-40">
							<Tabs
								value={state.aspectRatio}
								options={template.aspectRatios}
								onChange={(v) => patch((s) => ({ ...s, aspectRatio: v }))}
							/>
						</div>
					)}
				</div>
				<div className="flex flex-1 items-center justify-center overflow-hidden p-8">
					<div
						ref={mountRef}
						className="w-full max-w-110 overflow-hidden rounded-xl shadow-2xl"
					/>
				</div>
			</div>

			{/* SIDEBAR */}
			{template && state && (
				<aside className="h-screen w-96 shrink-0 space-y-4 overflow-y-auto border-l border-neutral-800 bg-neutral-900/40 p-4">
					<h2 className="text-lg font-semibold">Editor</h2>

					<Section
						title="Source Asset"
						enabled={state.sections.source}
						onToggle={(v) => setSection("source", v)}
					>
						<label className="block cursor-pointer rounded-lg border border-dashed border-neutral-700 py-6 text-center text-xs text-neutral-400 hover:border-teal-500">
							Klik untuk ganti gambar
							<input
								type="file"
								accept="image/*"
								className="hidden"
								onChange={onReplace}
							/>
						</label>
					</Section>

					<Section
						title="Effect Parameters"
						enabled={state.sections.effects}
						onToggle={(v) => setSection("effects", v)}
					>
						{Object.keys(state.effects).length === 0 && (
							<p className="text-xs text-neutral-500">
								Template ini tidak memakai efek.
							</p>
						)}
						{Object.entries(state.effects).map(([id, fx]) =>
							Object.entries(fx.params).map(([key, val]) => {
								const d = EFFECT_REGISTRY[fx.type]?.params[key];
								if (d?.kind === "select" && d.options) {
									return (
										<label key={`${id}-${key}`} className="block space-y-1">
											<span className="text-xs text-neutral-400">
												{d.label}
											</span>
											<select
												value={val}
												onChange={(e) =>
													setEffect(id, key, Number(e.target.value))
												}
												className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-teal-500"
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

					{state.mask && (
						<Section title="Mask Text">
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
								label="Size"
								value={state.mask.size}
								min={40}
								max={800}
								step={1}
								onChange={(v) => setMask({ size: v })}
							/>
						</Section>
					)}

					{state.textFill && (
						<Section title="Text Fill">
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
								label="Size"
								value={state.textFill.size}
								min={8}
								max={60}
								step={1}
								onChange={(v) => setTextFill({ size: v })}
							/>
							<Slider
								label="Line Height"
								value={state.textFill.lineHeight}
								min={8}
								max={60}
								step={1}
								onChange={(v) => setTextFill({ lineHeight: v })}
							/>
							<ColorField
								label="Color"
								value={state.textFill.color}
								onChange={(v) => setTextFill({ color: v })}
							/>
							<div>
								<p className="mb-1 text-xs text-neutral-400">Mode</p>
								<Tabs
									value={state.textFill.mode}
									options={["inner", "outer"]}
									onChange={(v) =>
										setTextFill({ mode: v as "inner" | "outer" })
									}
								/>
							</div>
						</Section>
					)}

					<Section
						title="Typography Overlay"
						enabled={state.sections.typography}
						onToggle={(v) => setSection("typography", v)}
					>
						{template.layers
							.filter(
								(l): l is Extract<typeof l, { type: "text" }> =>
									l.type === "text",
							)
							.map((layer) => {
								const t = state.texts[layer.slot];
								return (
									<div
										key={layer.slot}
										className="space-y-2 rounded-lg bg-neutral-800/40 p-3"
									>
										<p className="text-xs text-neutral-400">{layer.label}</p>
										<TextField
											value={t.value}
											onChange={(v) => setText(layer.slot, { value: v })}
										/>
										<Select
											value={t.font}
											options={template.fonts}
											onChange={(v) => setText(layer.slot, { font: v })}
										/>
										<Slider
											label="Size"
											value={t.size}
											min={8}
											max={200}
											step={1}
											onChange={(v) => setText(layer.slot, { size: v })}
										/>
										<Slider
											label="Letter Spacing"
											value={t.letterSpacing}
											min={0}
											max={20}
											step={0.1}
											onChange={(v) =>
												setText(layer.slot, { letterSpacing: v })
											}
										/>
										<ColorField
											label="Color"
											value={t.color}
											onChange={(v) => setText(layer.slot, { color: v })}
										/>
									</div>
								);
							})}
					</Section>

					<Section
						title="Canvas Settings"
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
								label="Color"
								value={state.background.color}
								onChange={(v) => setBg({ color: v })}
							/>
						) : (
							<div className="space-y-2">
								{state.background.gradient.stops.map((stop, i) => (
									<ColorField
										key={`stop-${i}`}
										label={`Stop ${i + 1} (${Math.round(stop.position * 100)}%)`}
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
									label="Angle"
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
							<div className="space-y-3 rounded-lg border border-neutral-800 p-3">
								<p className="text-xs font-medium text-neutral-300">
									Select Texture
								</p>
								<div className="grid grid-cols-4 gap-2">
									{TEXTURE_CATALOG.map((t) => {
										const active = state.background.texture?.name === t.name;
										return (
											<button
												key={t.name}
												type="button"
												onClick={() => onPickTexture(t.name)}
												className={`overflow-hidden rounded-lg border-2 ${active ? "border-teal-400" : "border-neutral-700"}`}
											>
												{t.name === "none" ? (
													<div className="grid h-12 place-items-center text-[10px] text-neutral-500">
														None
													</div>
												) : (
													<img
														src={`/textures/${t.name}.png`}
														alt={t.label}
														className="h-12 w-full object-cover"
													/>
												)}
												<span className="block truncate px-1 py-0.5 text-[9px] text-neutral-400">
													{t.label}
												</span>
											</button>
										);
									})}
								</div>

								{state.background.texture.name !== "none" && (
									<div className="space-y-2 border-t border-neutral-800 pt-3">
										<div className="flex items-center justify-between">
											<span className="text-xs text-neutral-400">
												Blend Mode
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
											label={`Opacity ${state.background.texture.opacity}%`}
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
											label={`Fill ${state.background.texture.fill}%`}
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

					{/* Image Controls — saat text-fill aktif, hanya scale/rotation/opacity yang
              berefek (dipakai untuk transform mask siluet gambar), jadi filter di bawah
              yang menentukan kontrol mana yang tampil. Section ini TETAP dirender untuk
              kedua mode, cuma daftar kontrolnya yang berbeda. */}
					<Section title="Image Controls">
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
									value={state.image[key as keyof EditorState["image"]]}
									min={d.min}
									max={d.max}
									step={d.step}
									onChange={(v) => setImg(key as keyof EditorState["image"], v)}
								/>
							))}
					</Section>

					<button
						type="button"
						onClick={() => engineRef.current?.exportPNG()}
						className="w-full rounded-lg bg-teal-500 py-3 font-semibold text-neutral-900 hover:bg-teal-400"
					>
						EXPORT PNG
					</button>
				</aside>
			)}
		</div>
	);
}
