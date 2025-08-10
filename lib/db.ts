import mongoose from "mongoose";

const mongoDB_URI = process.env.MONGODB_URI!;

if (!mongoDB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
        bufferCommands: false,
        maxPoolSize: 10,
        maxIdleTimeMS: 10000,
    }
    mongoose.connect(mongoDB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Failed to connect to database");
  }

  return cached.conn;
}
