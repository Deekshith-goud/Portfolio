import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteStats",
  title: "Site Statistics",
  type: "document",
  fields: [
    defineField({
      name: "views",
      title: "Total Views",
      type: "number",
      description: "Total number of unique visitors to the site",
      initialValue: 0,
      validation: (rule) => rule.required().min(0),
    }),
  ],
  preview: {
    select: {
      title: "views",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `Total Views: ${title}`,
      };
    },
  },
});
