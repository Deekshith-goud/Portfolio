import { defineField, defineType } from "sanity";

export default defineType({
  name: "visitorMarksGallery",
  title: "Visitor Marks Gallery",
  type: "document",
  fields: [
    defineField({
      name: "partIndex",
      title: "Part Index",
      type: "number",
      initialValue: 1,
    }),
    defineField({
      name: "estimatedBytes",
      title: "Estimated Bytes",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "marks",
      title: "Marks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "id", type: "string", title: "ID" },
            { name: "authorName", type: "string", title: "Author Name" },
            { name: "description", type: "text", title: "Message/Description" },
            { name: "svgContent", type: "text", title: "SVG Path Data" },
            { name: "color", type: "string", title: "Stroke Color" },
            { name: "canvasWidth", type: "number", title: "Canvas Width" },
            { name: "canvasHeight", type: "number", title: "Canvas Height" },
            { name: "createdAt", type: "datetime", title: "Created At" },
          ],
        },
      ],
    }),
  ],
});
