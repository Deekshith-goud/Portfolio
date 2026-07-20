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
      initialValue: 0
    })
  ]
});
