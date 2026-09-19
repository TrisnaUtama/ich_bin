/**
 * Minimal ambient types for the Google Identity Services script
 * (https://accounts.google.com/gsi/client) — just the surface area
 * features/auth actually uses. Not an official/complete typing.
 */
declare namespace google.accounts.id {
	type CredentialResponse = {
		credential: string;
		select_by?: string;
	};

	type PromptMomentNotification = {
		isDisplayMoment: () => boolean;
		isDisplayed: () => boolean;
		isNotDisplayed: () => boolean;
		isSkippedMoment: () => boolean;
		isDismissedMoment: () => boolean;
		getNotDisplayedReason: () => string;
		getSkippedReason: () => string;
		getDismissedReason: () => string;
	};

	type IdConfiguration = {
		client_id: string;
		callback: (response: CredentialResponse) => void;
		auto_select?: boolean;
		cancel_on_tap_outside?: boolean;
		use_fedcm_for_prompt?: boolean;
	};

	function initialize(config: IdConfiguration): void;
	function prompt(
		momentListener?: (notification: PromptMomentNotification) => void,
	): void;
	function disableAutoSelect(): void;
}

interface Window {
	google?: typeof google;
}
