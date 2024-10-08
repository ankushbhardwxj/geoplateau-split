import type { Db } from "mongodb";
import mongoose from "mongoose";
import { env } from "../utils/envConfig";

export default async (): Promise<Db> => {
  const { MONGO_URI } = env;
  const connection = await mongoose.connect(MONGO_URI);
  if (!connection.connection.db) {
    throw new Error("MongoDB connection failed");
  }
  return connection.connection.db;
};
