import { defineConfig } from "drizzle-kit";

// Only require DATABASE_URL if we're actually using the database
const databaseUrl = process.env.DATABASE_URL || "postgresql://localhost:5432/parkrank";

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
