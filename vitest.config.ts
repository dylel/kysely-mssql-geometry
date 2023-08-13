import { configDefaults, defineConfig } from "vitest/config";

const updatedConfig = defineConfig({
  test: {
    include: ["test/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: [...configDefaults.exclude, "/kysely-mssql-dialetct"],
  },
});

export default updatedConfig;
