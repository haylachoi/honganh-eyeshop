export const DUMP_DIR = "/tmp/mongo-backup";
export const MONGO_USER = process.env.MONGODB_USER;
export const MONGO_PASSWORD = process.env.MONGODB_PASSWORD;
export const MONGO_HOST = process.env.MONGODB_HOST || "localhost";
export const MONGO_PORT = process.env.MONGODB_PORT || 27017;
export const BACKUUP_TYPE = {
  DB: "db",
  STATIC: "static",
  FULL: "full",
};
