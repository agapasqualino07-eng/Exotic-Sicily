"use client";
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { SINGLETONS, structure } from "./src/sanity/structure";

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim() || "missing-project-id";
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim();

export default defineConfig({
  name: "default",
  title: "Exotic Dry Sicily",
  basePath: "/studio",
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    // I documenti "singoli" (impostazioni, home, store) non si possono creare/duplicare
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !["unpublish", "delete", "duplicate"].includes(action))
        : input,
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: "2025-02-19" })],
});
