import { defineField, defineType } from "sanity";

export default defineType({
  name: "visitor",
  title: "Visitor",
  type: "document",
  fields: [
    defineField({
      name: "visitorId",
      title: "Visitor ID",
      type: "string",
      description: "Unique identifier for the visitor",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "visitNumber",
      title: "Visit Number",
      type: "number",
      description: "The visitor's unique position in the total visitor count",
      validation: (rule) => rule.required().positive().integer(),
    }),
    defineField({
      name: "timestamp",
      title: "Timestamp",
      type: "datetime",
    }),
  ],
  preview: {
    select: {
      title: "visitorId",
      visitNumber: "visitNumber",
      subtitle: "_createdAt",
    },
    prepare(selection) {
      const { title, visitNumber, subtitle } = selection;
      if (!subtitle) {
        return { title: `Visitor #${visitNumber ?? "—"}`, subtitle: `ID: ${title}` };
      }
      const date = new Date(subtitle);
      return {
        title: `Visitor #${visitNumber ?? "—"}`,
        subtitle: `${date.toLocaleDateString()} at ${date.toLocaleTimeString()} · ID: ${title}`,
      };
    },
  },
});
