import pino from "pino";
import { settings } from "../configs/settings";

/**
 * App-wide structured logger. Use this everywhere instead of
 * console.log/console.error — pretty-printed in development, plain JSON
 * in production (so it's easy to pipe into a log aggregator later).
 */
export const logger = pino({
	level: settings.isProduction ? "info" : "debug",
	transport: settings.isProduction
		? undefined
		: {
				target: "pino-pretty",
				options: {
					colorize: true,
					translateTime: "SYS:standard",
					ignore: "pid,hostname",
				},
			},
});
