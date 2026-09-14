import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
const uri = env.match(/MONGODB_URI="?([^"\n]+)"?/)?.[1];
await mongoose.connect(uri, { dbName: "soulgood", serverSelectionTimeoutMS: 15000 });

const Lead = mongoose.model("Lead", new mongoose.Schema({}, { strict: false, collection: "leads" }));
const found = await Lead.find({ email: "e2e-verify@soulgood.test" }).lean();
console.log("matching docs:", found.length);
for (const d of found) {
  console.log("  -", d._id.toString(), d.name, d.pathway, d.intent, "localId=" + d.localId, "capturedAt=" + d.capturedAt);
}
const del = await Lead.deleteMany({ email: "e2e-verify@soulgood.test" });
console.log("cleaned up:", del.deletedCount);

await mongoose.disconnect();
