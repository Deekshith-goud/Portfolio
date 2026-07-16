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
      description: "Unique identifier for the visitor (stored in localStorage)",
      validation: (rule) => rule.required(),
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
      subtitle: "_createdAt",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      if (!subtitle) {
        return { title: "New Visitor", subtitle: title };
      }
      const date = new Date(subtitle);
      return {
        title: `Visitor on ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`,
        subtitle: `ID: ${title}`,
      };
    },
  },
});
