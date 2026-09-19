import { customType } from "drizzle-orm/pg-core";

/**
 * Case-insensitive text column (Postgres citext extension).
 * Run `create extension if not exists citext;` once per database before migrating.
 */
export const citext = customType<{ data: string }>({
  dataType: () => "citext",
});
