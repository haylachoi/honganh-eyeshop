"server only";

import { unstable_cache } from "next/cache";
import { connectToDatabase } from "..";
import User from "@/lib/db/model/user.model";
import { CACHE, ERROR_MESSAGES } from "@/constants";
import { AppError, Id } from "@/types";
import { SignUpType, UserType } from "@/features/auth/auth.type";
import { userSchema } from "@/features/auth/auth.validator";

// const getUsers = async () => {
//   await connectToDatabase();
//   const user = await User.find().sort({ name: -1 }).lean();
//
//   const result = user.map((user) => ({
//     ...user,
//     _id: user._id.toString(),
//   })) as UserType[];
//
//   return result;
// };

const getAllUsers = unstable_cache(
  async () => {
    await connectToDatabase();
    const user = await User.find().sort().lean();

    const result = user.map(({ _id, ...user }) => ({
      ...user,
      id: _id.toString(),
    })) as UserType[];

    return result;
  },
  CACHE.CATEGORIES.ALL.KEY_PARTS,
  {
    tags: [CACHE.CATEGORIES.ALL.TAGS],
    revalidate: 3600,
  },
);

const getUserById = async (id: Id) => {
  await connectToDatabase();
  const result = await User.findById(id).lean();
  // todo: check if user exist
  const user = userSchema.parse(result);
  return user;
};

const getUserByEmail = async (email: string) => {
  await connectToDatabase();
  const result = await User.findOne({ email }).lean();
  if (!result) {
    throw new AppError({ message: ERROR_MESSAGES.NOT_FOUND.INFO.SINGLE });
  }
  const user = userSchema.parse(result);
  return user;
};

const createUser = async (input: SignUpType) => {
  await connectToDatabase();
  const result = await User.create(input);
  const user = userSchema.parse(result);
  return user;
};

// const updateUser = async (user: UserUpdateType) => {
//   await connectToDatabase();
//   await User.findOneAndUpdate({ _id: user.id }, user, {
//     new: true,
//   });
// };

const deleteUser = async (ids: string | string[]) => {
  await connectToDatabase();
  const idsArray = Array.isArray(ids) ? ids : [ids];

  const existingUsers = await User.find({ _id: { $in: idsArray } });
  if (existingUsers.length !== idsArray.length) {
    throw new AppError({
      message: ERROR_MESSAGES.NOT_FOUND.ID.MULTIPLE,
    });
  }

  await User.deleteMany({ _id: { $in: idsArray } });

  return ids;
};

const userRepository = {
  getAllUsers,
  getUserByEmail,
  getUserById,
  createUser,
  // updateUser,
  deleteUser,
};

export default userRepository;
