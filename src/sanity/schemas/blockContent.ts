import { defineArrayMember, defineType } from "sanity";

export default defineType({
  name: "blockContent",
  title: "Post Body",
  type: "array",
  description: "Write your post content here",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Clear Floats", value: "clear" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: {
        hotspot: true,
        metadata: ["lqip", "blurhash", "palette"],
      },
      fields: [
        {
          name: "caption",
          title: "Image caption",
          type: "string",
          description: "Text displayed below the image.",
        },
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "Important for SEO and accessiblity.",
        },
        {
          name: "placement",
          title: "Image Placement",
          type: "string",
          description: "Customize where the image is positioned inside the rich text.",
          options: {
            list: [
              { title: "Center", value: "center" },
              { title: "Left", value: "left" },
              { title: "Right", value: "right" },
              { title: "Full Width", value: "full" },
            ],
            layout: "radio",
          },
          initialValue: "center",
        },
        {
          name: "sideText",
          title: "Side Text (Centered Beside Image)",
          type: "text",
          description: "Optional. Enter text here to create a perfectly vertically-centered side-by-side layout next to the image. (Use Left or Right placement to specify the image column side).",
        },
      ],
    }),
    defineArrayMember({
      type: "code",
      options: {
        language: "typescript",
        withFilename: true,
        languageAlternatives: [
          { title: "Bash", value: "bash" },
          { title: "JavaScript", value: "js" },
          { title: "TypeScript", value: "ts" },
          { title: "TSX", value: "tsx" },
          { title: "JSX", value: "jsx" },
          { title: "CSS", value: "css" },
          { title: "Groq", value: "graphql" },
          { title: "HTML", value: "html" },
          { title: "Json", value: "json" },
          { title: "Markdown", value: "md" },
          { title: "Python", value: "py" },
          { title: "SCSS", value: "scss" },
          { title: "SQL", value: "sql" },
          { title: "Yaml", value: "yaml" },
          { title: "Java", value: "java" },
        ],
      },
    }),
    defineArrayMember({
      type: "youtube",
    }),
    defineArrayMember({
      type: "customTable",
    }),
    defineArrayMember({
      type: "quiz",
    }),
  ],
});
