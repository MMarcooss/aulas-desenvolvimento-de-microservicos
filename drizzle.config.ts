import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/modules/**/infra/schemas/*.ts",
  out: "./src/shared/infra/database/drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://postgres:postgres@localhost:5432/school_control",
  },
});