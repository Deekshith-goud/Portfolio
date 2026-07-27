import { BiCamera } from "react-icons/bi";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "photo",
  title: "Photos",
  type: "document",
  icon: BiCamera,
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Upload a photo",
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
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
      description: "Optional caption for the photo",
    }),
  ],
});

