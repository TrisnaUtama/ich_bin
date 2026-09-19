import { Hono } from "hono";
import { templates } from "@kinnetic/db";
import { config } from "./src/config/settings";
import { db } from "./src/db";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

// quick smoke test that the db package + connection actually work
app.get("/templates", async (c) => {
  const rows = await db.select().from(templates).limit(20);
  return c.json({ templates: rows });
});

export default { port: config.port, fetch: app.fetch };
