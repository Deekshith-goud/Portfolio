import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";
import { codeInput } from "@sanity/code-input";
import { table } from "@sanity/table";
import { projectId, dataset } from "./src/sanity/lib/env.api";

export default defineConfig({
  name: "deekshith",
  title: "Deekshith Studio",
  basePath: "/studio",
  projectId,
  dataset,
  plugins: [deskTool(), visionTool(), codeInput(), table()],
  schema: { types: schemaTypes },
});
