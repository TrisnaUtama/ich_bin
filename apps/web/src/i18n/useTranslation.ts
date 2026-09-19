import { useMemo } from "react";
import { useLocaleStore } from "#/stores/locale-store";
import { dictionaries, type Dictionary } from "./index";

function get(obj: unknown, path: string): unknown {
	return path
		.split(".")
		.reduce<unknown>(
			(acc, key) =>
				acc && typeof acc === "object" ? (acc as Record<string, unknown>)[key] : undefined,
			obj,
		);
}

export function useTranslation() {
	const locale = useLocaleStore((s) => s.locale);
	const setLocale = useLocaleStore((s) => s.setLocale);
	const dict = dictionaries[locale] as Dictionary;

	const t = useMemo(() => {
		return (path: string): string => {
			const value = get(dict, path);
			return typeof value === "string" ? value : path;
		};
	}, [dict]);

	const tList = useMemo(() => {
		return (path: string): readonly string[] => {
			const value = get(dict, path);
			return Array.isArray(value) ? (value as string[]) : [];
		};
	}, [dict]);

	return { t, tList, locale, setLocale, dict };
}
