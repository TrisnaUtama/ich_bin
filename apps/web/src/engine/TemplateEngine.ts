import {
	type Application,
	Assets,
	ColorMatrixFilter,
	Container,
	type Filter,
	Graphics,
	Sprite,
	Text,
	TextStyle,
	Texture,
} from "pixi.js";
import type { EditorState } from "#/engine/editorState";
import { EFFECTS, type EffectModule } from "#/engine/effects";
import type {
	GradientStop,
	ImageControls,
	MaskText,
	Template,
	TextFill,
} from "#/engine/type";

interface EffectInstance {
	module: EffectModule;
	filter: Filter;
}

export class TemplateEngine {
	private app: Application;
	private template: Template;

	private bgContainer = new Container();
	private bgTexture: Texture | null = null;

	private imageSprite: Sprite | null = null;
	private imageBaseScale = 1;
	private colorFilter = new ColorMatrixFilter();

	private maskConfig: MaskText | null = null;
	private maskText: Text | null = null;

	private textFillObj: Text | null = null;
	private textFillMask: Sprite | null = null;
	private textFillSourceTex: Texture | null = null;
	private textFillConfig: TextFill | null = null;
	private textFillMode: "inner" | "outer" = "inner";

	private effectInstances = new Map<string, EffectInstance>();
	private textureOverlay: Sprite | null = null;
	private texts = new Map<string, Text>();

	constructor(app: Application, template: Template) {
		this.app = app;
		this.template = template;
	}

	async build(input: { image: string }) {
		const { width, height } = this.template.canvas;
		const scene = new Container();
		this.app.stage.addChild(scene);
		scene.addChild(this.bgContainer);

		for (const layer of this.template.layers) {
			if (layer.type === "image") {
				const texture = await Assets.load({
					src: input.image,
					loadParser: "loadTextures",
				});
				const sprite = new Sprite(texture);
				sprite.anchor.set(0.5);
				sprite.x = width / 2;
				sprite.y = height / 2;
				this.imageBaseScale = fitScale(
					texture,
					width,
					height,
					layer.fit ?? "cover",
				);
				sprite.scale.set(this.imageBaseScale);

				const filters: Filter[] = [this.colorFilter];
				for (const fx of layer.effects) {
					const module = EFFECTS[fx.type];
					if (!module) continue;
					const filter = module.create();
					this.effectInstances.set(fx.id, { module, filter });
					filters.push(filter);
				}
				sprite.filters = filters;
				this.imageSprite = sprite;
				scene.addChild(sprite);

				// MASK TEKS — gambar tampil di dalam bentuk huruf
				if (layer.maskText) {
					this.maskConfig = layer.maskText;
					const mt = new Text({
						text: layer.maskText.text,
						style: new TextStyle({
							fontFamily: layer.maskText.font,
							fontSize: layer.maskText.size,
							fontWeight: "bold",
							fill: "#ffffff",
							letterSpacing: layer.maskText.letterSpacing ?? 0,
						}),
					});
					mt.x = layer.maskText.x;
					mt.y = layer.maskText.y;
					scene.addChild(mt);
					sprite.mask = mt;
					this.maskText = mt;
				}

				// TEXT FILL — teks memenuhi kanvas, di-mask alpha gambar (inner/outer)
				if (layer.textFill) {
					this.textFillConfig = layer.textFill;
					const tf = layer.textFill;
					this.textFillMode = tf.mode;

					const textBlock = new Text({
						text: buildRepeatedText(
							tf.text,
							width,
							height,
							tf.size,
							tf.lineHeight,
						),
						style: new TextStyle({
							fontFamily: tf.font,
							fontSize: tf.size,
							fill: tf.color,
							lineHeight: tf.lineHeight,
							align: "justify",
							wordWrap: true,
							wordWrapWidth: width,
							breakWords: true,
						}),
					});

					this.textFillSourceTex = texture;
					const maskTex = makeAlphaMaskTexture(
						texture,
						width,
						height,
						tf.mode === "outer",
					);
					const maskSprite = new Sprite(maskTex);
					maskSprite.anchor.set(0.5);
					maskSprite.x = width / 2;
					maskSprite.y = height / 2;
					scene.addChild(maskSprite);

					textBlock.mask = maskSprite;
					scene.addChild(textBlock);

					this.textFillObj = textBlock;
					this.textFillMask = maskSprite;

					sprite.visible = false;
				}
			}
		}

		const overlay = new Sprite(Texture.EMPTY);
		overlay.visible = false;
		this.textureOverlay = overlay;
		scene.addChild(overlay);

		for (const layer of this.template.layers) {
			if (layer.type === "text") {
				const t = new Text({
					text: layer.default,
					style: new TextStyle({
						fontFamily: layer.font,
						fontSize: layer.size,
						fill: layer.color,
					}),
				});
				t.x = layer.x;
				t.y = layer.y;
				this.texts.set(layer.slot, t);
				scene.addChild(t);
			}
		}
	}

	sync(state: EditorState) {
		this.syncBackground(state);
		this.bgContainer.visible = state.sections.canvas;

		if (this.imageSprite) {
			const img = this.imageSprite;
			const ic = state.image;
			img.visible = state.sections.source && !this.textFillObj;
			img.alpha = ic.opacity / 100;
			img.scale.set(this.imageBaseScale * (ic.scale / 100));
			img.rotation = (ic.rotation * Math.PI) / 180;
			applyColor(this.colorFilter, ic);
		}

		// text-fill: Scale/Rotation/Opacity diterapkan ke MASK (bentuk siluet)
		if (this.textFillMask && this.textFillObj) {
			const ic = state.image;
			const { width, height } = this.template.canvas;
			this.textFillMask.anchor.set(0.5);
			this.textFillMask.x = width / 2;
			this.textFillMask.y = height / 2;
			this.textFillMask.scale.set(ic.scale / 100);
			this.textFillMask.rotation = (ic.rotation * Math.PI) / 180;
			this.textFillObj.alpha = ic.opacity / 100;
		}

		if (this.maskText && state.mask && this.maskConfig) {
			this.maskText.text = state.mask.text;
			this.maskText.style.fontFamily = state.mask.font;
			this.maskText.style.fontSize = state.mask.size;
			this.maskText.x = this.maskConfig.x;
			this.maskText.y = this.maskConfig.y;
		}

		if (this.textFillObj && state.textFill && this.textFillConfig) {
			const tf = state.textFill;
			const { width, height } = this.template.canvas;
			this.textFillObj.visible = state.sections.source;
			this.textFillObj.text = buildRepeatedText(
				tf.text,
				width,
				height,
				tf.size,
				tf.lineHeight,
			);
			this.textFillObj.style.fontFamily = tf.font;
			this.textFillObj.style.fontSize = tf.size;
			this.textFillObj.style.fill = tf.color;
			this.textFillObj.style.lineHeight = tf.lineHeight;

			// regenerasi mask HANYA saat mode berubah
			if (
				this.textFillMask &&
				this.textFillSourceTex &&
				tf.mode !== this.textFillMode
			) {
				this.textFillMode = tf.mode;
				const newMask = makeAlphaMaskTexture(
					this.textFillSourceTex,
					width,
					height,
					tf.mode === "outer",
				);
				const old = this.textFillMask.texture;
				this.textFillMask.texture = newMask;
				if (old !== this.textFillSourceTex && old !== Texture.WHITE)
					old.destroy(true);
			}
		}

		for (const [id, inst] of this.effectInstances) {
			const fx = state.effects[id];
			const on = state.sections.effects && fx?.enabled;
			inst.module.apply(inst.filter, on && fx ? fx.params : {}, 0);
		}

		if (this.textureOverlay) {
			const tx = state.background.texture;
			const show =
				state.sections.canvas &&
				tx &&
				tx.name !== "none" &&
				this.textureOverlay.texture !== Texture.EMPTY;
			this.textureOverlay.visible = Boolean(show);
			if (tx) {
				this.textureOverlay.blendMode = tx.blendMode;
				this.textureOverlay.alpha =
					(tx.opacity / 100) * ((tx.fill ?? 100) / 100);
			}
		}

		for (const [slot, t] of this.texts) {
			const s = state.texts[slot];
			if (!s) continue;
			t.visible = state.sections.typography;
			t.text = s.value;
			t.style.fontFamily = s.font;
			t.style.fontSize = s.size;
			t.style.fill = s.color;
			t.style.letterSpacing = s.letterSpacing;
			t.style.fontWeight = s.weight;
			t.style.align = s.align;
		}
	}

	private syncBackground(state: EditorState) {
		const { width, height } = this.template.canvas;
		for (const child of this.bgContainer.removeChildren()) child.destroy();
		if (this.bgTexture) {
			this.bgTexture.destroy(true);
			this.bgTexture = null;
		}
		const b = state.background;
		if (b.kind === "solid") {
			this.bgContainer.addChild(
				new Graphics()
					.rect(0, 0, width, height)
					.fill({ color: b.color, alpha: b.opacity }),
			);
		} else {
			const tex = makeGradientTexture(
				width,
				height,
				b.gradient.angle,
				b.gradient.stops,
			);
			this.bgTexture = tex;
			const s = new Sprite(tex);
			s.width = width;
			s.height = height;
			s.alpha = b.opacity;
			this.bgContainer.addChild(s);
		}
	}

	async setImage(url: string) {
		const tex = await Assets.load({ src: url, loadParser: "loadTextures" });
		const { width, height } = this.template.canvas;
		this.imageBaseScale = fitScale(tex, width, height, "cover");
		if (this.imageSprite) {
			this.imageSprite.texture = tex;
			this.imageSprite.scale.set(this.imageBaseScale);
		}
		if (this.textFillMask) {
			this.textFillSourceTex = tex;
			const maskTex = makeAlphaMaskTexture(
				tex,
				width,
				height,
				this.textFillMode === "outer",
			);
			this.textFillMask.texture = maskTex;
		}
	}

	async setTexture(name: string) {
		const overlay = this.textureOverlay;
		if (!overlay) return;
		if (name === "none") {
			overlay.visible = false;
			return;
		}
		try {
			const tex = await Assets.load(`/textures/${name}.png`);
			overlay.texture = tex;
			overlay.width = this.template.canvas.width;
			overlay.height = this.template.canvas.height;
			overlay.visible = true;
		} catch {
			overlay.visible = false;
		}
	}

	async exportPNG() {
		await this.app.renderer.extract.download({
			target: this.app.stage,
			filename: "text-kinetic.png",
		});
	}
}

function fitScale(
	tex: Texture,
	w: number,
	h: number,
	fit: "cover" | "contain",
): number {
	const sx = w / tex.width;
	const sy = h / tex.height;
	return fit === "cover" ? Math.max(sx, sy) : Math.min(sx, sy);
}

// Buat tekstur mask dari alpha gambar. inverted=true → alpha dibalik (mode outer).
function makeAlphaMaskTexture(
	source: Texture,
	w: number,
	h: number,
	inverted: boolean,
): Texture {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d");
	if (!ctx) return Texture.WHITE;

	const res = source.source.resource as CanvasImageSource | undefined;
	if (!res) return Texture.WHITE;

	const scale = Math.max(w / source.width, h / source.height);
	const dw = source.width * scale;
	const dh = source.height * scale;
	ctx.drawImage(res, (w - dw) / 2, (h - dh) / 2, dw, dh);

	const data = ctx.getImageData(0, 0, w, h);
	const px = data.data;
	for (let i = 0; i < px.length; i += 4) {
		const a = inverted ? 255 - px[i + 3] : px[i + 3];
		px[i] = 255;
		px[i + 1] = 255;
		px[i + 2] = 255;
		px[i + 3] = a;
	}
	ctx.putImageData(data, 0, 0);
	return Texture.from(c);
}

function buildRepeatedText(
	text: string,
	w: number,
	h: number,
	size: number,
	lineHeight: number,
): string {
	const charsPerLine = Math.ceil(w / (size * 0.55));
	const lines = Math.ceil(h / Math.max(lineHeight, 1)) + 2;
	const totalChars = charsPerLine * lines;
	const unit = `${text.trim()} `;
	const repeatCount = Math.max(1, Math.ceil(totalChars / unit.length));
	return unit.repeat(repeatCount);
}

function applyColor(f: ColorMatrixFilter, ic: ImageControls) {
	f.reset();
	f.brightness(1 + ic.exposure / 100, true);
	f.contrast(ic.contrast / 100, true);
	f.saturate(ic.saturation / 100, true);
	f.hue(ic.tint * 0.9, true);
	f.hue(ic.temperature * 0.3, true);
	f.brightness(1 + (ic.highlights + ic.shadows) / 400, true);
}

function makeGradientTexture(
	w: number,
	h: number,
	angle: number,
	stops: GradientStop[],
): Texture {
	const c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	const ctx = c.getContext("2d");
	if (!ctx) return Texture.WHITE;
	const rad = (angle * Math.PI) / 180;
	const x = Math.cos(rad);
	const y = Math.sin(rad);
	const grad = ctx.createLinearGradient(
		w / 2 - (x * w) / 2,
		h / 2 - (y * h) / 2,
		w / 2 + (x * w) / 2,
		h / 2 + (y * h) / 2,
	);
	for (const s of stops)
		grad.addColorStop(Math.min(1, Math.max(0, s.position)), s.color);
	ctx.fillStyle = grad;
	ctx.fillRect(0, 0, w, h);
	return Texture.from(c);
}
