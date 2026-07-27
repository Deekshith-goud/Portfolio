import { BiHeart } from "react-icons/bi";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "hobby",
  title: "Hobbies",
  type: "document",
  icon: BiHeart,
  fields: [
    defineField({
      name: "name",
      title: "Hobby Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Generate a unique slug for the hobby page",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "text",
      description: "A brief summary for the preview card",
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: "body",
      title: "Full Content",
      type: "blockContent",
      description: "Detailed content for the individual hobby page",
    }),
    defineField({
      name: "iconName",
      title: "Icon Name",
      type: "string",
      description: "Name of the icon from react-icons (e.g., BiCamera, BiJoystick, BiGlobe)",
    }),
    defineField({
      name: "thumbnail",
      title: "Thumbnail Image",
      type: "image",
      options: {
        hotspot: true,
        metadata: ["lqip"],
      },
      fields: [
        {
          name: "alt",
          title: "Alt",
          type: "string",
        },
      ],
    }),
  ],
});
