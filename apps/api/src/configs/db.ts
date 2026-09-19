import { createDb } from "@kinnetic/db";
import { settings } from "./settings";

export const db = createDb(settings.database.url);
