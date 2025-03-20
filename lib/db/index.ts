import mongoose from "mongoose";

const globalWithMongoose = globalThis as typeof globalThis & {
  mongooseCache?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

const cached = globalWithMongoose.mongooseCache || {
  conn: null,
  promise: null,
};

export const connectToDatabase = async (
  MONGODB_URI = process.env.MONGODB_URI,
) => {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is missing");

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI);
  cached.conn = await cached.promise;

  globalWithMongoose.mongooseCache = cached;

  return cached.conn;
};
