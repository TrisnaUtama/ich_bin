import type { MessageCode } from "../message-codes";

export const de = {
	VALIDATION_ERROR: "Die übermittelten Daten sind ungültig.",
	INTERNAL_ERROR:
		"Auf unserer Seite ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
	NOT_FOUND: "Die angeforderte Ressource wurde nicht gefunden.",
	AUTH_MISSING_BEARER_TOKEN: "Zugriffstoken fehlt.",
	AUTH_INVALID_ACCESS_TOKEN: "Zugriffstoken ist ungültig oder abgelaufen.",
	AUTH_INVALID_GOOGLE_TOKEN: "Das Google-Token ist ungültig.",
	AUTH_EMAIL_NOT_VERIFIED: "Deine Google-E-Mail ist nicht verifiziert.",
	AUTH_INVALID_REFRESH_TOKEN: "Refresh-Token ist ungültig.",
	AUTH_REFRESH_TOKEN_EXPIRED:
		"Refresh-Token ist abgelaufen, bitte melde dich erneut an.",
	AUTH_REFRESH_TOKEN_REUSED:
		"Wiederverwendung des Refresh-Tokens erkannt. Alle Sitzungen wurden aus Sicherheitsgründen widerrufen.",
	USER_NOT_FOUND: "Benutzer nicht gefunden.",

	LOGIN_SUCCESS: "Erfolgreich angemeldet.",
	TOKEN_REFRESHED: "Token erfolgreich aktualisiert.",
	LOGOUT_SUCCESS: "Erfolgreich abgemeldet.",
	PROFILE_FETCHED: "Profil erfolgreich abgerufen.",
} satisfies Record<MessageCode, string>;
