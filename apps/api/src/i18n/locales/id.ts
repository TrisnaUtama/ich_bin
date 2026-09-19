import type { MessageCode } from "../message-codes";

export const id = {
	VALIDATION_ERROR: "Data yang dikirim tidak valid.",
	INTERNAL_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
	NOT_FOUND: "Data tidak ditemukan.",
	AUTH_MISSING_BEARER_TOKEN: "Token akses tidak ditemukan.",
	AUTH_INVALID_ACCESS_TOKEN: "Token akses tidak valid atau sudah kedaluwarsa.",
	AUTH_INVALID_GOOGLE_TOKEN: "Token Google tidak valid.",
	AUTH_EMAIL_NOT_VERIFIED: "Email Google kamu belum terverifikasi.",
	AUTH_INVALID_REFRESH_TOKEN: "Refresh token tidak valid.",
	AUTH_REFRESH_TOKEN_EXPIRED:
		"Refresh token sudah kedaluwarsa, silakan login ulang.",
	AUTH_REFRESH_TOKEN_REUSED:
		"Terdeteksi penggunaan ulang refresh token. Semua sesi telah dicabut demi keamanan.",
	USER_NOT_FOUND: "Pengguna tidak ditemukan.",

	LOGIN_SUCCESS: "Berhasil login.",
	TOKEN_REFRESHED: "Token berhasil diperbarui.",
	LOGOUT_SUCCESS: "Berhasil logout.",
	PROFILE_FETCHED: "Profil berhasil diambil.",
} satisfies Record<MessageCode, string>;
