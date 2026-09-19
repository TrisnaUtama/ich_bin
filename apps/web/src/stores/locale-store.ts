import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LOCALE, type Locale } from "#/i18n";

type LocaleState = {
	locale: Locale;
	setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>()(
	persist(
		(set) => ({
			locale: DEFAULT_LOCALE,
			setLocale: (locale) => set({ locale }),
		}),
		{ name: "kinnetic-locale" },
	),
);
