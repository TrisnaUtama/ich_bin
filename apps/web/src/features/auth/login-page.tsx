import { AuthShowcase } from "./components/auth-showcase";
import { LoginPanel } from "./components/login-panel";

export function LoginPage() {
	return (
		<main className="min-h-[100svh] bg-ink-950 lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-0 lg:p-7">
			<LoginPanel />
			<AuthShowcase className="mx-5 mb-8 h-[22rem] sm:mx-10 sm:h-[26rem] lg:mx-0 lg:mb-0 lg:h-auto lg:min-h-[calc(100svh-3.5rem)]" />
		</main>
	);
}
