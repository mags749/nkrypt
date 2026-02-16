import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/infra/database/schema/index.ts',
  out: './src/infra/database/migrations',
  dialect: 'sqlite',
  driver: 'expo',
});
