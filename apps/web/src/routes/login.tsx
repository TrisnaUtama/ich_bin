import { createFileRoute, redirect } from "@tanstack/react-router";
import { DEFAULT_TEMPLATE } from "#/engine/templateList";
import { LoginPage } from "#/features/auth";
import { useAuthStore } from "#/stores/auth-store";

export const Route = createFileRoute("/login")({
	beforeLoad: () => {
		if (useAuthStore.getState().isAuthenticated) {
			throw redirect({
				to: "/editor",
				search: { template: DEFAULT_TEMPLATE },
			});
		}
	},
	component: LoginPage,
});
