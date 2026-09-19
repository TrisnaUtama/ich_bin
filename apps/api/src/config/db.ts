import { createDb } from "@kinnetic/db";
import { config } from ".";

export const db = createDb(config.database.url);
