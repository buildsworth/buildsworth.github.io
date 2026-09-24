import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://buildsworthdc.com",
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/thanks") && !page.includes("/404"),
    }),
  ],
  output: "static",
  build: {
    inlineStylesheets: "auto",
  },
});
