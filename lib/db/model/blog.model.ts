import { blogTypeSchema } from "@/features/blogs/blog.validators";
import mongoose, { Model, model, models, Schema, Document } from "mongoose";
import { z } from "zod";

type DbModel = z.input<typeof blogTypeSchema>;

interface BlogModel extends Document, DbModel {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<BlogModel>(
  {
    title: { type: String, required: true },
    titleNoAccent: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: false },
    wallImage: { type: String, required: false },
    images: { type: [String], required: false },
    content: { type: String, required: true },
    toc: [
      {
        id: { type: String, required: true },
        text: { type: String, required: true },
        level: { type: Number, required: true },
      },
    ],
    author: {
      _id: { type: Schema.Types.ObjectId, ref: "User", required: true },
      name: { type: String, required: true },
    },
    isPublished: { type: Boolean, required: true, default: true },
    tags: [String],
  },
  {
    timestamps: true,
  },
);

blogSchema.index({ title: 1 }, { unique: true });
blogSchema.index({ titleNoAccent: "text" }, { default_language: "none" });
blogSchema.index({ slug: 1 }, { unique: true });

const Blog =
  (models.Blog as Model<BlogModel>) || model<BlogModel>("Blog", blogSchema);

export default Blog;
