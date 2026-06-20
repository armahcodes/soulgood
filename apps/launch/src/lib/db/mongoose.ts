import mongoose from "mongoose";

/**
 * Cached Mongoose connection for serverless (Vercel) environments.
 *
 * Each invocation of a serverless function may reuse a warm container, so we
 * cache the connection promise on `globalThis` to avoid opening a new pool on
 * every request (which exhausts Atlas connection limits). This is the standard
 * Next.js + Mongoose pattern.
 */

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalForMongoose = globalThis as typeof globalThis & {
  _mongoose?: MongooseCache;
};

const cache: MongooseCache = globalForMongoose._mongoose ?? {
  conn: null,
  promise: null,
};
globalForMongoose._mongoose = cache;

/** Database the microsite stores leads in, independent of the URI's path. */
const DEFAULT_DB_NAME = "soulgood";

/**
 * Connect to MongoDB (idempotent). Returns the shared Mongoose instance.
 * Throws if `MONGODB_URI` is not set.
 *
 * The database name is forced via `dbName` (defaults to `soulgood`, overridable
 * with `MONGODB_DB`) so leads land in a known database regardless of whether the
 * connection string includes a database path.
 */
export async function connectToDatabase(
  uri: string | undefined = process.env.MONGODB_URI,
  dbName: string = process.env.MONGODB_DB || DEFAULT_DB_NAME,
): Promise<typeof mongoose> {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName,
    });
  }

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Reset so a later request can retry instead of reusing a rejected promise.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
