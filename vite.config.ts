import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import spaServer from "vite-spa-server";

export default defineConfig({
  plugins: [
    react(),
    spaServer({
      entry: "./src/backend/index.ts",
      port: 3000,
      serverType: "express",
      // Production entry is provided by src/server-entry.mjs so PORT works.
      buildServer: false,
    }),
  ],
});
