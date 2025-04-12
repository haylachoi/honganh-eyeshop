import { Heading as TiptapHeading } from "@tiptap/extension-heading";

export const HeadingWithId = TiptapHeading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => {
          return attributes.id ? { id: attributes.id } : {};
        },
      },
    };
  },
});
