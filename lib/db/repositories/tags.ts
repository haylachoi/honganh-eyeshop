import { ERROR_MESSAGES } from "@/constants/messages.constants";
import { connectToDatabase } from "..";
import Tags from "../model/tag.model";
import { TagInputType, TagType, TagUpdateType } from "@/features/tags/tag.type";
import { Id } from "@/types";
import { tagTypeSchema } from "@/features/tags/tag.validator";
import Product from "../model/product.model";
import mongoose from "mongoose";
import { NotFoundError } from "@/lib/error";

const getTagById = async (id: Id) => {
  await connectToDatabase();
  const result = await Tags.findById(id).lean();
  const tag = tagTypeSchema.parse(result);
  return tag;
};

const getAllTags = async () => {
  await connectToDatabase();
  const result = await Tags.find().lean();
  const tags = result.map((tag) => tagTypeSchema.parse(tag)) as TagType[];

  return tags;
};

const createTag = async (tag: TagInputType) => {
  await connectToDatabase();
  const result = await Tags.create(tag);

  return result._id.toString();
};

const updateTag = async (tag: TagUpdateType) => {
  await connectToDatabase();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await Tags.findOneAndUpdate({ _id: tag.id }, tag, {
      session,
    });
    if (!result) {
      throw new NotFoundError({
        resource: "tag",
        message: ERROR_MESSAGES.TAG.NOT_FOUND,
      });
    }

    await Product.updateMany(
      { "tags._id": tag.id },
      { $set: { "tags.$[t].name": tag.name } },
      { arrayFilters: [{ "t._id": tag.id }], session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};
const deleteTag = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const count = await Tags.countDocuments({ _id: { $in: idsArray } });

  if (count !== idsArray.length) {
    throw new NotFoundError({
      resource: "tag",
      message: ERROR_MESSAGES.TAG.NOT_FOUND,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    await Tags.deleteMany(
      { _id: { $in: idsArray } },
      {
        session,
      },
    );
    await Product.updateMany(
      { "tags._id": { $in: idsArray } },
      { $pull: { tags: { _id: { $in: idsArray } } } },
      {
        session,
      },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
  return ids;
};
const tagsRepository = {
  getTagById,
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};

export default tagsRepository;
