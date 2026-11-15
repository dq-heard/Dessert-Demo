import { defineConfig, envField } from "astro/config";
import react from "@astrojs/react";
import sanity from "@sanity/astro";
import { projectId, dataset, apiVersion } from "./sanity/env";
import icon from "astro-icon";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  integrations: [
    icon(),
    sanity({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      studioBasePath: "/studio",
    }),
    react(),
  ],

  adapter: cloudflare(),
  env: {
    schema: {
      STRIPE_SECRET_KEY: envField.string({
        context: "server",
        access: "secret",
      }),
    },
  },
});
