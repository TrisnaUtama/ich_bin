#!/usr/bin/env bun
/**
 * Scaffold a new schema file under src/schema/, prefixed with a UTC
 * timestamp (YYYYMMDDHHmmss_) so files always sort in the order they were
 * created — makes it obvious what came first and safe to spot what a
 * later file depends on before deleting/renaming anything. Timestamps
 * (vs. a running counter) also avoid collisions when two people create a
 * schema file on separate branches around the same time.
 *
 * Wires the new file into the barrel export (src/schema/index.ts)
 * automatically so it's never forgotten.
 *
 * Usage:
 *   bun scripts/new-schema.ts <name>
 *   bun scripts/new-schema.ts notifications
 *   bun scripts/new-schema.ts order_items
 */

import { existsSync } from "node:fs";
import { join } from "node:path";

const rawName = process.argv[2];

if (!rawName) {
	console.error("Usage: bun scripts/new-schema.ts <table-name>");
	console.error("Example: bun scripts/new-schema.ts notifications");
	process.exit(1);
}

// normalize: "Order Items" / "order-items" / "OrderItems" -> "order_items"
const snakeCase = rawName
	.replace(/([a-z0-9])([A-Z])/g, "$1_$2")
	.replace(/[\s-]+/g, "_")
	.toLowerCase();

const schemaDir = join(import.meta.dir, "..", "src", "schema");
const indexPath = join(schemaDir, "index.ts");

const timestamp = getTimestamp();
const fileName = `${timestamp}_${snakeCase}`; // e.g. 20260920143012_order_items
const tableConst = toCamelCase(snakeCase); // e.g. orderItems
const typeBase = toPascalCase(snakeCase); // e.g. OrderItems -> singularized below
const typeName = typeBase.endsWith("s") ? typeBase.slice(0, -1) : typeBase; // best-effort singular

const filePath = join(schemaDir, `${fileName}.ts`);

if (existsSync(filePath)) {
	console.error(`✗ ${fileName}.ts already exists in src/schema/`);
	process.exit(1);
}

const template = `import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const ${tableConst} = pgTable("${snakeCase}", {
	id: uuid("id").primaryKey().defaultRandom(),

	// TODO: add your columns here

	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ${typeName} = typeof ${tableConst}.$inferSelect;
export type New${typeName} = typeof ${tableConst}.$inferInsert;
`;

await Bun.write(filePath, template);
console.log(`✓ created src/schema/${fileName}.ts`);

// append export to the barrel file if not already there
const indexContent = await Bun.file(indexPath).text();
const exportLine = `export * from "./${fileName}";`;

if (!indexContent.includes(exportLine)) {
	const updated = indexContent.trimEnd() + `\n${exportLine}\n`;
	await Bun.write(indexPath, updated);
	console.log(`✓ added export to src/schema/index.ts`);
}

console.log(`\nNext steps:`);
console.log(`  1. Fill in the columns in src/schema/${fileName}.ts`);
console.log(`  2. If it references another table, import it by its full`);
console.log(`     prefixed filename, e.g. import { users } from "./0001_users";`);
console.log(`  3. make db-generate`);
console.log(`  4. review the generated SQL in migrations/`);
console.log(`  5. make db-migrate`);

/** UTC timestamp as YYYYMMDDHHmmss, e.g. 20260920143012. */
function getTimestamp(): string {
	const now = new Date();
	const pad = (n: number) => String(n).padStart(2, "0");

	return [
		now.getUTCFullYear(),
		pad(now.getUTCMonth() + 1),
		pad(now.getUTCDate()),
		pad(now.getUTCHours()),
		pad(now.getUTCMinutes()),
		pad(now.getUTCSeconds()),
	].join("");
}

function toCamelCase(str: string): string {
	return str.replace(/_([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function toPascalCase(str: string): string {
	const camel = toCamelCase(str);
	return camel.charAt(0).toUpperCase() + camel.slice(1);
}
