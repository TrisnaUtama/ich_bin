import type { ReactNode } from "react";

export function Section(props: {
	title: string;
	enabled?: boolean;
	onToggle?: (v: boolean) => void;
	children: ReactNode;
}) {
	return (
		<div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
			<div className="mb-3 flex items-center justify-between">
				<h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
					{props.title}
				</h3>
				{props.onToggle && (
					<Toggle value={props.enabled ?? true} onChange={props.onToggle} />
				)}
			</div>
			<div className="space-y-3">{props.children}</div>
		</div>
	);
}

export function Toggle(props: {
	value: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<button
			type="button"
			onClick={() => props.onChange(!props.value)}
			className={`h-5 w-9 rounded-full transition-colors ${props.value ? "bg-teal-500" : "bg-neutral-700"}`}
		>
			<span
				className={`block h-4 w-4 rounded-full bg-white transition-transform ${props.value ? "translate-x-4" : "translate-x-0.5"}`}
			/>
		</button>
	);
}

export function Slider(props: {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	onChange: (v: number) => void;
}) {
	return (
		<div>
			<div className="mb-1 flex justify-between text-xs text-neutral-400">
				<span>{props.label}</span>
				<span className="text-neutral-300">{props.value}</span>
			</div>
			<input
				type="range"
				min={props.min}
				max={props.max}
				step={props.step}
				value={props.value}
				onChange={(e) => props.onChange(Number(e.target.value))}
				className="w-full accent-teal-400"
			/>
		</div>
	);
}

export function ColorField(props: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-xs text-neutral-400">{props.label}</span>
			<div className="flex items-center gap-2">
				<span className="text-xs uppercase text-neutral-300">
					{props.value}
				</span>
				<input
					type="color"
					value={props.value}
					onChange={(e) => props.onChange(e.target.value)}
					className="h-6 w-6 cursor-pointer rounded border border-neutral-700 bg-transparent"
				/>
			</div>
		</div>
	);
}

export function TextField(props: {
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<input
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
			className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-teal-500"
		/>
	);
}

export function Select(props: {
	value: string;
	options: readonly string[];
	onChange: (v: string) => void;
}) {
	return (
		<select
			value={props.value}
			onChange={(e) => props.onChange(e.target.value)}
			className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100 outline-none focus:border-teal-500"
		>
			{props.options.map((o) => (
				<option key={o} value={o}>
					{o}
				</option>
			))}
		</select>
	);
}

export function Tabs(props: {
	value: string;
	options: readonly string[];
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex gap-1 rounded-lg bg-neutral-800 p-1">
			{props.options.map((o) => (
				<button
					key={o}
					type="button"
					onClick={() => props.onChange(o)}
					className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
						props.value === o
							? "bg-teal-500 text-neutral-900"
							: "text-neutral-400 hover:text-neutral-200"
					}`}
				>
					{o}
				</button>
			))}
		</div>
	);
}
