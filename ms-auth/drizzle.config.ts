import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/shared/infra/database/schemas/*.ts",
	out: "./drizzle",
	dialect: "postgresql",
});
