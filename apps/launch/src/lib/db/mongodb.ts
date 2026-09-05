import { MongoClient, type Db } from "mongodb";

type MongoCache = {
  client: MongoClient;
  db: Db;
};

const globalForMongo = globalThis as typeof globalThis & {
  _soulGoodMongo?: MongoCache;
};

export function getMongoDatabase(): MongoCache {
  if (globalForMongo._soulGoodMongo) return globalForMongo._soulGoodMongo;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    retryReads: true,
    retryWrites: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
    socketTimeoutMS: 15000,
  });
  const db = client.db(process.env.MONGODB_DB || "soulgood");
  const resources = { client, db };
  globalForMongo._soulGoodMongo = resources;
  return resources;
}
