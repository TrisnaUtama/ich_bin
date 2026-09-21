import { Link } from "@tanstack/react-router";
import { BrandMark } from "#/components/ui/brand-mark";
import { LanguageSwitcher } from "#/components/ui/language-switcher";

export function PageHeader() {
	return (
		<header className="px-6 py-8 sm:px-10 lg:px-20">
			<div className="mx-auto flex max-w-[1320px] items-center justify-between">
				<Link to="/" className="inline-block">
					<BrandMark className="text-lg" />
				</Link>
				<LanguageSwitcher />
			</div>
		</header>
	);
}
