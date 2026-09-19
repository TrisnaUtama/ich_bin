export { createDb, type Database } from "./client";
export * from "./schema";

// Re-exported so consumers (apps/api) never need to depend on "drizzle-orm"
// directly — importing it from its own package.json alongside this one
// caused bun to install two separate drizzle-orm instances with
// incompatible private types (see the "shouldInlineParams" TS errors this
// fixed). Add more operators here as modules need them.
export {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notInArray,
  or,
  sql,
} from "drizzle-orm";
