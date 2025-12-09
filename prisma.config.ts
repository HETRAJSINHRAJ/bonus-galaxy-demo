import { defineConfig } from "prisma/config";
import path from "node:path";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: "file:./dev.db",
  },
});
